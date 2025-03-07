<script setup lang="ts">
import {
  ref,
  type PropType,
  type Ref,
  inject,
  onMounted,
  onUnmounted,
  computed,
} from "vue";
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
const addItemModal = ref<HTMLDivElement | null>(null);
const modalHidden = ref(true);
const edit = inject<Ref<boolean>>(editKey);

function showAddItemModal() {
  const fileInputs =
    addItemModal.value?.querySelectorAll<HTMLInputElement>(
      'input[type="file"]'
    );
  fileInputs?.forEach((input) => {
    input.value = "";
    input.files = null;
  });
  modalHidden.value = !modalHidden.value;
}

const isNewItem = computed(
  () => item.value.index === undefined || item.value.index === null
);

function processItem() {
  if (!item.value?.name) return console.warn("item.value has no item");
  if (isNewItem.value) {
    item.value.index = items.value.length;
    item.value.store = props.storeIndex;
    items.value.push(item.value);
    emits("item", item.value);
  } else {
    // Item is in edit mode
    // This is done in place because the data is reactive
    return;
  }

  closeModal();
  item.value = {} as Item;
}

function emitDeleteItem(id: number | string) {
  const item = items.value.find((i) => `${i.index}` === `${id}`);
  if (!item) return console.warn("Item not found");

  items.value = items.value.filter((i) => `${i.index}` !== `${id}`);
  emits("deleteItem", item);
}

const isInfinite = computed(() => item.value?.stock?.toString().includes("infinit"));

function closeModal() {
  modalHidden.value = true;
  const inputs =
    addItemModal.value?.querySelectorAll<HTMLInputElement>(
      'input[type="file"]'
    );
  inputs?.forEach((input) => {
    input.value = "";
    input.files = null;
  });
}

function constructImageUrl(item: Item, event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files) return console.warn("No files selected");
  if (!item.images) item.images = [];

  for (const key in files) {
    const file = files[key];
    if (typeof file !== "object") continue;
    const reader = new FileReader();
    reader.onload = (e) => {
      item.images.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  target.files = null;
}

function deleteStore() {
  emits("deleteStore", props.storeIndex);
  shop.value?.remove();
}

const deleteStoreIfEmpty = () => {
  if (items.value.length === 0) {
    deleteStore();
  }
};

if (props.starter?.length) {
  items.value = props.starter;
  props.starter.forEach((i) => {
    emits("item", i);
  });
}

onMounted(() => {
  window.addEventListener(
    "nuxt-form-builder:clear-empty-stores",
    deleteStoreIfEmpty
  );
});
onUnmounted(() => {
  window.removeEventListener(
    "nuxt-form-builder:clear-empty-stores",
    deleteStoreIfEmpty
  );
});
</script>

<template>
  <div ref="shop">
    <div class="shop-icons">
      <div class="icon new">
        <Transition mode="out-in">
          <div class="icon edit" v-if="!edit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              @click="edit = true"
            >
              <path
                d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"
              ></path>
            </svg>
          </div>
          <div class="icon edit" v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              @click="edit = false"
            >
              <path
                d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"
              ></path>
            </svg>
          </div>
        </Transition>
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
        <div
          class="add-item-card-button"
          title="add item"
          role="button"
          v-if="edit"
          @click="showAddItemModal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
            ></path>
          </svg>
        </div>
        <div v-for="storeItem in items" class="item">
          <StoreCard
            :item="storeItem"
            @delete="emitDeleteItem"
            @edit="
              item = storeItem;
              showAddItemModal();
            "
          />
        </div>
      </div>
    </div>
  </div>
  <div
    class="add-item-container"
    :class="{ hidden: modalHidden }"
    ref="addItemModal"
    @keyup.esc="closeModal"
  >
    <form class="add-item" @submit.prevent="processItem">
      <div style="padding-top: 1.5rem">
        <input
          type="text"
          placeholder="Name"
          class="add-item-input"
          autocomplete="off"
          required
          v-model="item.name"
        />
        <div style="display: flex; flex-direction: column; margin-top: 6px">
          <input
            type="number"
            :disabled="isInfinite"
            :placeholder="isInfinite ? 'Infinite' : 'Quantity'"
            class="add-item-input"
            autocomplete="off"
            v-model="item.stock"
          />
          <label
            style="display: flex; flex-direction: column; padding: 5px 5px"
          >
            <div>
              <input
                type="checkbox"
                @change="(event) => {
                if((event.target as HTMLInputElement).checked){
                  item.stock = 'infinity'
                } else {
                  // @ts-expect-error
                  item.stock = undefined
                }
              }"
              />
              <span style="margin-left: 5px">Infinite</span>
            </div>
            <small
              >Check this if the item is intangible (cannot be depleted)</small
            >
          </label>
        </div>
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
          :required="isNewItem"
          v-on:change="constructImageUrl(item, $event)"
        />
      </div>
      <div class="add-item-buttons">
        <button class="add-item-button" type="submit">Add</button>
        <button class="cancel-button" @click="closeModal">Cancel</button>
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
  justify-content: left;
  gap: 10px;
}

.add-item-card-button {
  background-color: white;
  border-radius: 10px;
  color: rgba(128, 128, 128, 0.8);
  display: grid;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  transition: background-color 0.3s ease-out;
}

.add-item-card-button:hover {
  background-color: rgb(235, 235, 235);
}

.add-item-card-button svg {
  width: 250px;
  margin: auto;
}
</style>
