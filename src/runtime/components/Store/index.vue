<script setup lang="ts">
import { ref, type PropType, type Ref, inject } from "vue";
import type { Item } from "../../types";
import { editKey } from "../../utils/symbols";

const emits = defineEmits<{
  item: [item: Item];
  deleteStore: [store: string];
  deleteItem: [item: Item];
}>();

const props = defineProps({
  storeIndex: {
    type: String,
    required: true,
  },
  starter: {
    type: Array as PropType<Array<Item>>,
    default: [],
  },
});

const shop = ref<HTMLElement | null>(null);
const item = ref<Item>({} as Item);
const items = ref<Array<Item>>([]);
const modal = ref(null);
const modalHidden = ref(true);
const edit = inject<Ref<boolean>>(editKey);

function addItemModal() {
  modalHidden.value = !modalHidden.value;
}

function emitItem() {
  if (!item.value) return console.warn("item.value has no item");
  item.value.index = items.value.length;
  item.value.store = props.storeIndex;
  items.value.push(item.value);
  emits("item", item.value);
  closeModal();
  item.value = {} as Item;
}

function emitDeleteItem(id: number | string) {
  const item = items.value.find((i) => `${i.index}` === `${id}`);
  if (!item) return console.warn("Item not found");

  items.value = items.value.filter((i) => `${i.index}` !== `${id}`);
  emits("deleteItem", item);
}

function closeModal() {
  modalHidden.value = true;
}

function constructImageUrl(item: Item, event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return console.warn("No files selected");

  for (const file in files) {
    const obj = files[file];
    if (typeof obj !== "object") continue;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!item.images) item.images = [];
      item.images.push(e.target?.result as string);
    };
    reader.readAsDataURL(obj);
  }
}

function deleteStore() {
  emits("deleteStore", props.storeIndex);
  shop.value?.remove();
}

if (props.starter?.length) {
  items.value = props.starter;
  props.starter.forEach((i) => {
    emits("item", i);
  });
}

const editingItem = ref<Item>();
</script>

<template>
  <div ref="shop">
    <div class="shop-icons">
      <div class="icon new">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          @click="addItemModal"
        >
          <path
            d="M4 1V4H1V6H4V9H6V6H9V4H6V1H4ZM3 20.0066V11H5V19H13V14C13 13.45 13.45 13 14 13L19 12.999V5H11V3H20.0066C20.5552 3 21 3.45576 21 4.00247V15L15 20.996L4.00221 21C3.4487 21 3 20.5551 3 20.0066ZM18.171 14.999L15 15V18.169L18.171 14.999Z"
          ></path>
        </svg>
      </div>
      <div class="icon delete">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          @click="deleteStore"
        >
          <path
            d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"
          ></path>
        </svg>
      </div>
    </div>
    <div class="shop-container" :class="{ 'bg-wheat': edit }">
      <div class="items">
        <div v-for="item in items" class="item">
          <StoreCard :item="item" @delete="emitDeleteItem" @edit="editingItem = item"/>
        </div>
      </div>
    </div>
  </div>
  <div
    class="add-item-container"
    :class="{ hidden: modalHidden }"
    ref="modal"
    @keyup.esc="closeModal"
  >
    <form class="add-item" @submit.prevent="emitItem">
      <h3>Add an item to the store</h3>
      <div style="padding-top: 1rem">
        <input
          type="text"
          placeholder="Name"
          class="add-item-input"
          autocomplete="off"
          required
          v-model="item.name"
        />
        <input
          type="number"
          placeholder="Quantity"
          class="add-item-input"
          autocomplete="off"
          v-model="item.stock"
        />
        <input
          type="number"
          placeholder="Price"
          class="add-item-input"
          autocomplete="off"
          required
          v-model="item.price"
        />
        <input
          type="file"
          class="add-item-input"
          multiple
          required
          v-on:change="constructImageUrl(item, $event)"
        />
      </div>
      <div class="add-item-buttons">
        <button class="add-item-button" type="submit">Add</button>
        <button class="cancel-button" @click="closeModal">Cancel</button>
      </div>
    </form>
  </div>
  <div
    class="add-item-container"
    v-if="editingItem"
    :class="{ hidden: editingItem === undefined }"
    ref="modal"
    @keyup.esc="editingItem = undefined"
  >
    <form class="add-item" @submit.prevent="editingItem = undefined">
      <h3>Edit item: {{ editingItem.name }}</h3>
      <div style="padding-top: 1rem">
        <input
          type="text"
          placeholder="Name"
          class="add-item-input"
          autocomplete="off"
          required
          v-model="editingItem.name"
        />
        <input
          type="number"
          placeholder="Quantity"
          class="add-item-input"
          autocomplete="off"
          v-model="editingItem.stock"
        />
        <input
          type="number"
          placeholder="Price"
          class="add-item-input"
          autocomplete="off"
          required
          v-model="editingItem.price"
        />
        <input
          type="file"
          class="add-item-input"
          multiple
          v-on:change="constructImageUrl(item, $event)"
        />
      </div>
      <div class="add-item-buttons">
        <button class="add-item-button" type="submit">OK</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.shop-container {
  max-width: 800px;
  margin: auto;
  min-height: 5rem;
  height: fit-content;
  border-radius: 0.2rem;
  position: relative;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
}

.bg-wheat {
  background-color: wheat;
}

.shop-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #323232;
  width: fit-content;
  padding: 2px;
  border-radius: 0.15rem;
  margin-bottom: 0.4rem;
  margin-top: 0.5rem;
  gap: 8px;
}

.icon {
  padding: 4px;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.icon:hover {
  background-color: #464545;
}

.icon.new:hover svg {
  color: #00ff00;
}

.icon.delete:hover svg {
  color: #ff0000;
}

.add-item-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-item {
  background-color: white;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  margin-top: -5rem;
  overflow: hidden;
}

.add-item h3 {
  font-size: 1.2rem;
  padding: 0.5rem 0.5rem 0.5rem 1.3rem;
  color: white;
  background-color: #262626;
  text-transform: capitalize;
}

.add-item > div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem;
}

.add-item-input {
  padding: 0.5rem;
  border-radius: 0.2rem;
  border: 1px solid #e5e5e5;
  font-size: 1rem;
}

.add-item-input[type="file"] {
  padding: 0.25rem;
}

.add-item-input[type="file"]::-webkit-file-upload-button {
  height: 28px;
  border-radius: 0.2rem;
  background-color: #323232;
  color: white;
  cursor: pointer;
  border: none;
}

.add-item-input:focus {
  outline: 1px solid #e5e5e5;
}

.add-item-buttons {
  display: flex;
  gap: 0.6rem !important;
  padding-top: 1rem !important;
}

.add-item-button {
  padding: 0.5rem;
  border-radius: 0.2rem;
  color: white;
  cursor: pointer;
  border: none;
  background-color: #262626;
}

.add-item-button:hover {
  background-color: #323232;
}

.cancel-button {
  padding: 0.5rem;
  border-radius: 0.2rem;
  background-color: #e5e5e5;
  color: #262626;
  cursor: pointer;
  border: none;
}

.cancel-button:hover {
  background-color: #e9e9e9;
}

.hidden {
  display: none;
}

.items {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  justify-content: center;
}
</style>
