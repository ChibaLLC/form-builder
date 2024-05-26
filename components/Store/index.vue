<script setup lang="ts">
import { type Item } from "~/typings"

const shop = ref<HTMLElement | null>(null)
const item = ref<Item>({} as Item)
const items = ref<Array<Item>>([])
const emits = defineEmits<{
  item: [item: Item],
  deleteStore: [store: number],
  deleteItem: [{ item: number, store: number }]
}>()
const modal = ref(null)
const modalHidden = ref(true)

const props = defineProps({
  storeIndex: {
    type: Number,
    required: true
  }
})

function addItemModal() {
  modalHidden.value = false
}

function emitItem() {
  if (!item.value) return console.warn("item.value has no item")
  item.value.index = items.value.length + 1 || 0
  item.value.store = props.storeIndex

  for (const key in item.value) {
    // @ts-ignore
    if (item.value[key] === undefined) return alert(`Please fill all the fields\n Required: ${key}`);
  }

  items.value.push(item.value)
  emits('item', item.value)
  closeModal()
  item.value = {} as Item
}

function emitDeleteItem(id: number) {
  items.value = items.value.filter(i => i.index !== id)
  emits('deleteItem', { store: props.storeIndex, item: id })
}

function closeModal() {
  modalHidden.value = true
}

function constructImageUrl(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return console.warn("No files selected")

  for (const file in files) {
    const obj = files[file]
    if (typeof obj !== "object") continue

    const reader = new FileReader()
    reader.onload = (e) => {
      if (!item.value.images) item.value.images = []
      item.value.images.push(e.target?.result as string)
    }
    reader.readAsDataURL(obj)
  }
}

function deleteStore() {
  emits('deleteStore', props.storeIndex)
  shop.value?.remove()
}
</script>

<template>
  <div ref="shop" class="max-w-[800px] m-auto">
    <div class="flex justify-between">
      <div class="bg-emerald-700 text-white w-fit mb-2 mt-2 px-4 py-2 rounded cursor-pointer" @click="addItemModal">
        <span>Add</span>
      </div>
      <div class="bg-red-700 text-white w-fit ml-2 mb-2 mt-2 px-4 py-2 rounded cursor-pointer" @click="deleteStore">
        <span>Delete</span>
      </div>
    </div>
    <div class="bg-white h-fit min-h-32 rounded pb-6 relative">
      <div class="items">
        <div v-for="item in items" class="item">
          <StoreCard :item="item"/>
        </div>
      </div>
    </div>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center -mt-40 z-20"
      :class="{ 'hidden': modalHidden }" ref="modal">
      <div class="bg-white p-4 rounded max-w-[500px]">
        <div>
          <input type="text" placeholder="Name" class="w-full p-2 border border-gray-300 rounded mb-2"
            v-model="item.name" />
          <input type="text" placeholder="Quantity" class="w-full p-2 border border-gray-300 rounded mb-2"
            v-model="item.qtty">
          <input type="number" placeholder="Price" class="w-full p-2 border border-gray-300 rounded mb-2"
            v-model="item.price" />
          <input type="file" class="w-full p-2 border border-gray-300 rounded mb-2" multiple
            v-on:change="constructImageUrl" />
        </div>
        <div class="flex justify-between">
          <button class="bg-blue-950 text-white px-4 py-2 rounded" @click="emitItem">Add</button>
          <button class="bg-red-950 text-white px-4 py-2 rounded" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>