<script setup lang="ts">
import {type Item} from "~/typings"

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
  emits('deleteItem', {store: props.storeIndex, item: id})
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
  <div ref="shop">
    <div class="flex justify-between">
      <div class="bg-blue-950 text-white w-fit mb-2 mt-2 px-4 py-2 rounded cursor-pointer" @click="addItemModal">
        <span>Add Item</span>
      </div>
      <div class="bg-red-950 text-white w-fit ml-2 mb-2 mt-2 px-4 py-2 rounded cursor-pointer" @click="deleteStore">
        <span>Delete Store</span>
      </div>
    </div>
    <div class="bg-blue-950 rounded pb-6 relative h-fit min-h-32">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="item in items" class="bg-blue-950 text-white rounded p-4">
          <div class="flex justify-end">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                 class="text-white text-2xl mx-auto p-0.5 cursor-pointer"
                 title="Delete Item" @click="() => emitDeleteItem(item.index)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z" fill="#1C274C"/>
            </svg>
          </div>
          <div class="flex justify-center">
            <img v-for="image in item.images" :src="image" alt="item" class="w-20 h-20"/>
          </div>
          <div class="flex justify-between">
            <span>{{ item.name }}</span>
            <span>{{ item.price }}</span>
            <span>{{ item.qtty }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center -mt-40 z-10"
       :class="{'hidden': modalHidden}" ref="modal">
    <div class="bg-white p-4 rounded">
      <input type="text" placeholder="Name" class="w-full p-2 border border-gray-300 rounded mb-2" v-model="item.name"/>
      <input type="text" placeholder="Quantity" class="w-full p-2 border border-gray-300 rounded mb-2"
             v-model="item.qtty">
      <input type="number" placeholder="Price" class="w-full p-2 border border-gray-300 rounded mb-2"
             v-model="item.price"/>
      <input type="file" class="w-full p-2 border border-gray-300 rounded mb-2" multiple
             v-on:change="constructImageUrl"/>
      <div class="flex justify-between">
        <button class="bg-blue-950 text-white px-4 py-2 rounded" @click="emitItem">Add</button>
        <button class="bg-red-950 text-white px-4 py-2 rounded" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>