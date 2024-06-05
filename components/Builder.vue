<script setup lang="ts">
import { type CSSProperties, render } from 'vue';
import { Field, type FormElementData, type Item } from '~/typings';

defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: false,
    default: () => ({
      backgroundColor: "#262626",
      color: "#FFF",
      height: "100svh"
    })
  }
})

const stores = reactive(new Map<number, Array<Item>>())

const draggedElement = ref<Field | undefined>(undefined)

function setDragged(value: Field) {
  draggedElement.value = value
}

const canvasContainer = ref<HTMLElement | null>(null)
const Canvas = resolveComponent('Canvas')
const canvases = ref<Array<any>>([])
const formElements = ref<Array<FormElementData>>([])

function addCanvas() {
  if (!canvasContainer.value) return console.error('Canvas container not found')

  const div = document.createElement("div")
  div.dataset.id = String(canvases.value.length)
  const node = h(Canvas, {
    draggedElement: draggedElement,
    index: canvases.value.length,
    formElements: formElements,
    onDelete: (index: number) => {
      canvases.value = canvases.value.filter((_, i) => i !== index)
      canvasContainer.value?.querySelector(`[data-id="${index}"]`)?.remove()
    }
  })
  render(node, div)
  canvasContainer.value.appendChild(div)
}

const Store = resolveComponent("Store")
function addStore() {
  if (!canvasContainer.value) return console.warn("Canvas not found")

  const div = document.createElement("div")
  const storeId = stores.size
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
  const store = stores.get(item.store)
  if (store) {
    store.push(item)
  } else {
    stores.set(item.store, [item])
  }
}

function deleteStoreItem({ item, store }: { store: number, item: number }) {
  const _store = stores.get(store)
  if (!_store) return console.warn("Store not found")
  stores.delete(store)
  stores.set(store, _store.filter(i => i.index !== item))
}

function deleteStore(id: number) {
  stores.delete(id)
}

function submit() {
  const form = {
    elements: formElements.value,
    stores: stores.entries()
  }

  console.log(form)

  localStorage.setItem("form", JSON.stringify(form))
}

onMounted(addCanvas)
</script>
<template>
  <div class="three max-w-[100svw] max-h-[100svh]">
    <div>
      <Panel @dragstart="setDragged" :styles="styles" />
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
          <Icon name="save" :styles="{ color: 'hsla(0,0%,15%,0.8' }" class="w-7"/>
        </li>
        <li>
          <Icon name="dollar" :styles="{ color: 'hsla(0,0%,15%,0.8' }" class="w-7"/>
        </li>
      </ul>
    </div>
    <div>
      <Properties :styles="styles" />
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
      background-color: hsla(0,0%,15%,0.8);
      color: white;
    }
  }
}
</style>