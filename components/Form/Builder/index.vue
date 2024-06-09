<script setup lang="ts">
import { type CSSProperties, render } from 'vue';
import {type FormElementData, type Item, type Forms, type Stores, type FormStoreData} from '~/typings';

defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: false,
    default: () => ({
      backgroundColor: "#262626",
      color: "#FFF",
      minHeight: "100svh"
    })
  }
})


const draggedElement = ref<keyof typeof Field | undefined>(undefined)

function setDragged(value: keyof typeof Field) {
  draggedElement.value = value
}

const canvasContainer = ref<HTMLElement | null>(null)
const Canvas = resolveComponent('FormBuilderCanvas')
const canvases = ref<Forms>({} as any)

function addCanvas() {
  if (!canvasContainer.value) return console.error('Canvas container not found')

  const div = document.createElement("div")
  div.dataset.id = String(Object.keys(canvases.value).length)
  const node = h(Canvas, {
    draggedElement: draggedElement,
    index: Object.keys(canvases.value).length,
    onDeleteCanvas: (index: number) => {
      canvasContainer.value?.querySelector(`[data-id="${index}"]`)?.remove()
      delete canvases.value[index]
    },
    onAddField: (index: number, field: FormElementData) => {
      const canvas = canvases.value[index]
      if (canvas) {
        canvas.push(field)
      } else {
        canvases.value[index] = [field]
      }
    },
    onDeleteField: (index: number, field: FormElementData) => {
      const canvas = canvases.value[index]
      if (canvas) {
        canvases.value[index] = canvas.filter(el => el.index !== field.index)
      } else {
        console.warn("Canvas Index not found")
      }
    },
    onUpdateField: (index: number, field: FormElementData) => {
      const canvas = canvases.value[index]
      if (canvas) {
        canvases.value[index] = canvas.map(el => el.index === index ? field : el)
      } else {
        console.warn("Canvas Index not found")
      }
    }
  })
  render(node, div)
  canvasContainer.value.appendChild(div)
}

const Store = resolveComponent("Store")
const stores = ref<Stores>({})
function addStore() {
  if (!canvasContainer.value) return console.warn("Canvas not found")

  const div = document.createElement("div")
  const storeId = Object.keys(stores.value).length
  div.dataset.id = storeId.toString()
  const node = h(Store, {
    onItem: addStoreItem,
    onDeleteItem: deleteStoreItem,
    onDeleteStore: deleteStore,
    storeIndex: storeId
  })
  render(node, div)
  canvasContainer.value.appendChild(div)
}

function addStoreItem(item: Item) {
  const store = stores.value[item.store]
  if (store) {
    stores.value[item.store].push(item)
  } else {
    stores.value[item.store] = [item]
  }
}

function deleteStoreItem(item: Item) {
  const store = stores.value[item.store]
  if (store) {
    stores.value[item.store] = store.filter(el => el.index !== item.index)
  } else {
    console.warn("Store not found")
  }
}

function deleteStore(id: number) {
  delete stores.value[id]
}

function submit() {
  const form = {
    forms: canvases.value,
    stores: stores.value
  } satisfies FormStoreData

  console.log(form)
  localStorage.setItem("form", JSON.stringify(form))
  navigateTo("/viewer")
}

onMounted(addCanvas)
</script>
<template>
  <div class="three max-w-[100svw] min-h-[100svh]">
    <div>
      <FormBuilderPanel @dragstart="setDragged" :styles="styles" />
    </div>
    <div class="relative w-full mt-0 px-10 pt-8 flex flex-col">
      <div ref="canvasContainer" class="flex flex-col gap-4 w-full"></div>
      <div class="w-full mx-auto flex max-w-[800px]">
        <div
            class="text-white flex bg-white rounded-sm border-solid border-[#262626] shadow-md border-opacity-10 justify-around z-10 ml-auto mt-1.5"
            style="border-width: 1px;">
          <Icon name="plus" title="Add Page Break" @click="addCanvas"
                class="mx-auto cursor-pointer text-[#262626] bg-white p-[4px] hover:bg-[hsla(0,0%,15%,0.8)] hover:text-white rounded-sm"
                :styles="{ width: '28px', height: '28px' }" />
          <Icon name="store" title="Add a Store Section" @click="addStore"
                class="mx-auto cursor-pointer text-[#262626] bg-white p-[4px] hover:bg-[hsla(0,0%,15%,0.8)] hover:text-white rounded-sm"
                :styles="{ width: '28px', height: '28px' }" />
        </div>
      </div>
      <ul class="foot-menu">
        <li @click="submit">
          <Icon name="save" :styles="{ color: 'hsla(0,0%,15%,0.8' }" class="w-7" />
        </li>
        <li>
          <Icon name="dollar" :styles="{ color: 'hsla(0,0%,15%,0.8' }" class="w-7" />
        </li>
      </ul>
    </div>
    <div>
      <FormBuilderProperties :styles="styles" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.three {
  display: flex;
  background-color: #191919;

  >div {
    &:first-child {
      width: 300px;
    }

    &:nth-child(2) {
      flex: 1;
    }

    &:last-child {
      width: 300px;
    }
  }
}

.foot-menu {
  position: absolute;
  z-index: 100;
  background-color: #FFF;
  border-radius: 5px;
  display: flex;
  bottom: 1rem;
  right: 50%;
  transform: translateX(50%);
  padding: 2px;

  >li {
    padding: 5px;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 4px;

    &:hover {
      background-color: hsla(0, 0%, 15%, 0.8);
      color: white;
    }
  }
}
</style>