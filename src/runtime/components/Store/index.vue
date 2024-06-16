<script setup lang="ts">
const emits = defineEmits<{
  item: [item: Item],
  deleteStore: [store: number],
  deleteItem: [item: Item]
}>()

const props = defineProps({
  storeIndex: {
    type: Number,
    required: true
  }
})

const shop = ref<HTMLElement | null>(null)
const item = ref<Item>({} as Item)
const items = ref<Array<Item>>([])
const modal = ref(null)
const modalHidden = ref(true)


function addItemModal() {
  modalHidden.value = false
}

function emitItem() {
  if (!item.value) return console.warn("item.value has no item")
  item.value.index = items.value.length
  item.value.store = props.storeIndex
  items.value.push(item.value)
  emits('item', item.value)
  closeModal()
  item.value = {} as Item
}

function emitDeleteItem(id: number) {
  const item = items.value.find(i => i.index === id)
  if (!item) return console.warn("Item not found")

  items.value = items.value.filter(i => i.index !== id)
  emits('deleteItem', item)
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
    <div class="flex bg-[#323232] w-fit py-0.5 rounded mb-2 gap-1">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" @click="addItemModal">
          <path
            d="M4 1V4H1V6H4V9H6V6H9V4H6V1H4ZM3 20.0066V11H5V19H13V14C13 13.45 13.45 13 14 13L19 12.999V5H11V3H20.0066C20.5552 3 21 3.45576 21 4.00247V15L15 20.996L4.00221 21C3.4487 21 3 20.5551 3 20.0066ZM18.171 14.999L15 15V18.169L18.171 14.999Z">
          </path>
        </svg>
      </div>
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" @click="deleteStore">
          <path
            d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z">
          </path>
        </svg>
      </div>
    </div>
    <div class="bg-white h-fit min-h-32 rounded pb-6 relative">
      <div class="items">
        <div v-for="item in items" class="item">
          <StoreCard :item="item" />
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

<style scoped lang="scss">
.icon {
  padding: 4px;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }

  &:hover {
    background-color: #464545;
  }
}
</style>
