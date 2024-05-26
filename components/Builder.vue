<script setup lang="ts">
import { render } from 'vue';
import { Field, type FormElementData, type Item } from '~/typings';

const canvasContainer = ref<HTMLElement | null>(null)
const draggedElement = ref<Field | undefined>(undefined)
const elements = ref<Array<FormElementData>>([])
const stores = reactive(new Map<number, Array<Item>>())

function setDragged(value: Field) {
  draggedElement.value = value
}

function addStoreItem(item: Item) {
  const store = stores.get(item.store)
  if (store) {
    store.push(item)
  } else {
    stores.set(item.store, [item])
  }
}

const Canvas = resolveComponent('Canvas')
const Store = resolveComponent("Store")
const canvases = ref<Array<any>>([])

function addCanvas() {
  if (!canvasContainer.value) return console.error('Canvas container not found')

  const div = document.createElement("div")
  div.dataset.id = String(canvases.value.length)
  const node = h(Canvas, {
    draggedElement: draggedElement,
    elements: elements,
    index: canvases.value.length,
    onDelete: (index: number) => {
      canvases.value = canvases.value.filter((_, i) => i !== index)
      canvasContainer.value?.querySelector(`[data-id="${index}"]`)?.remove()
    }
  })
  render(node, div)
  canvasContainer.value.appendChild(div)
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

onMounted(addCanvas)

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
</script>
<template>
  <div class="three max-w-[100svw] max-h-[100svh]">
    <div>
      <Panel @dragstart="setDragged" :styles="styles" />
    </div>
    <div class="relative w-full mt-0 px-10 pt-8 flex flex-col">
      <div ref="canvasContainer" class="flex flex-col gap-4 w-full"></div>
      <div class="w-full mx-auto flex px-3 max-w-[800px]">
        <div
          class="text-white flex w-20 bg-white rounded border-solid border-[#262626] shadow-md border-opacity-10 m-auto -mt-2 z-10"
          style="border-width: 1px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30px" height="30px"
            class="text-2xl mx-auto p-0.5 cursor-pointer text-[#262626] bg-white rounded-full" title="Add Page Break"
            @click="addCanvas">
            <path
              d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z">
            </path>
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            class="text-2xl mx-auto p-0.5 cursor-pointer text-[#262626] bg-white rounded-full" @click="addStore"
            title="Add a store section" width="30px" height="30px">
            <path
              d="M21 13.2422V20H22V22H2V20H3V13.2422C1.79401 12.435 1 11.0602 1 9.5C1 8.67286 1.22443 7.87621 1.63322 7.19746L4.3453 2.5C4.52393 2.1906 4.85406 2 5.21132 2H18.7887C19.1459 2 19.4761 2.1906 19.6547 2.5L22.3575 7.18172C22.7756 7.87621 23 8.67286 23 9.5C23 11.0602 22.206 12.435 21 13.2422ZM19 13.9725C18.8358 13.9907 18.669 14 18.5 14C17.2409 14 16.0789 13.478 15.25 12.6132C14.4211 13.478 13.2591 14 12 14C10.7409 14 9.5789 13.478 8.75 12.6132C7.9211 13.478 6.75911 14 5.5 14C5.331 14 5.16417 13.9907 5 13.9725V20H19V13.9725ZM5.78865 4L3.35598 8.21321C3.12409 8.59843 3 9.0389 3 9.5C3 10.8807 4.11929 12 5.5 12C6.53096 12 7.44467 11.3703 7.82179 10.4295C8.1574 9.59223 9.3426 9.59223 9.67821 10.4295C10.0553 11.3703 10.969 12 12 12C13.031 12 13.9447 11.3703 14.3218 10.4295C14.6574 9.59223 15.8426 9.59223 16.1782 10.4295C16.5553 11.3703 17.469 12 18.5 12C19.8807 12 21 10.8807 21 9.5C21 9.0389 20.8759 8.59843 20.6347 8.19746L18.2113 4H5.78865Z">
            </path>
          </svg>
        </div>
      </div>
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
</style>