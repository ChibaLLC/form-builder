<script setup lang="ts">
import { useStoreDrag } from "../../composables/drag";
import type { Store, StoreItem } from "@/types";
import { ref } from "vue";

const stores = ref<Store[]>([]);
const activeStore = ref<Store>({} as Store);
const productForm = ref<StoreItem>({
  id: Date.now().toString(),
  name: "",
  description: "",
  price: 0,
  images: [] as string[],
  infinite: false,
  quantity: 0,
});
const { startStoreDrag, storeDragOver, storeDrop } = useStoreDrag(stores);

// Functions
const switchStore = (store: Store) => {
  activeStore.value = store;
};
const addNewStore = () => {
  const storeId = stores.value.length + 1;
  const newStore = {
    id: storeId,
    name: `Store ${stores.value.length + 1}`,
    description: "",
    items: [] as StoreItem[],
  };

  stores.value.push(newStore);
  activeStore.value = newStore;
};
addNewStore();
const removeStore = (storeId: number) => {
  if (stores.value.length <= 1) {
    alert("You must have at least one store.");
    return;
  }

  if (
    confirm("Are you sure you want to delete this store and all its products?")
  ) {
    const index = stores.value.findIndex((store) => store.id === storeId);
    if (index > -1) {
      stores.value.splice(index, 1);
      // Switch to first available store
      if (activeStore.value.id === storeId) {
        activeStore.value = stores.value[0] || 1;
      }
    }
  }
};
const clearActiveStore = () => {
  if (
    activeStore.value &&
    confirm("Are you sure you want to clear this store?")
  ) {
    activeStore.value.items = [];
  }
};
const addItem = () => {
  activeStore.value.items.push({
    ...productForm.value,
  });

  productForm.value = {
    id: Date.now().toString(),
    name: "",
    description: "",
    price: 0,
    images: [] as string[],
    infinite: false,
    quantity: 0,
  };
};
const removeItem = (itemId: string) => {
  if (activeStore.value) {
    const index = activeStore.value.items.findIndex((p) => p.id === itemId);
    if (index > -1) {
      activeStore.value.items.splice(index, 1);
    }
  }
};

const clearAllItems = () => {
  if (
    activeStore.value &&
    confirm("Are you sure you want to remove all products from this store?")
  ) {
    activeStore.value.items = [];
  }
};
</script>
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Store Tabs -->
    <div class="bg-white border-b border-gray-200 px-6 py-2">
      <div class="flex items-center justify-center gap-2 overflow-x-auto">
        <div
          v-for="(store, index) in stores"
          :key="store.id"
          class="flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors group"
          :class="{
            'border-blue-500 bg-blue-50 text-blue-700':
              activeStore.id === store.id,
            'border-gray-200 bg-white hover:bg-gray-50':
              activeStore.id !== store.id,
          }"
          draggable="true"
          @click="switchStore(store)"
          @dragstart="startStoreDrag($event, store, index)"
          @dragover.prevent="storeDragOver($event)"
          @drop.prevent="storeDrop($event, index)"
        >
          <!-- Drag Handle -->
          <svg
            class="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>

          <span class="text-sm font-medium whitespace-nowrap">{{
            store.name
          }}</span>
          <span
            class="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600"
            >{{ store.items.length }}</span
          >

          <!-- Close button -->
          <button
            v-if="stores.length > 1"
            @click.stop="removeStore(store.id)"
            class="w-4 h-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-1">
      <!-- Main Content Area -->
      <div class="flex-1 p-6">
        <!-- Page Header -->
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">
              Stores ({{ stores.length }})
            </h2>
            <div class="flex items-center gap-3">
              <button
                @click="addNewStore"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Store
              </button>

              <button
                @click="clearActiveStore"
                class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Clear Store"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Store Name</label
              >
              <input
                v-model="activeStore.name"
                type="text"
                placeholder="Enter your store name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Products Display -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              Products ({{ activeStore.items.length }})
            </h3>
            <div class="flex items-center gap-2">
              <button
                v-if="activeStore.items.length > 0"
                @click=""
                class="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <!-- Products Grid -->
          <div
            v-if="activeStore.items.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="product in activeStore.items"
              :key="product.id"
              class="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group"
            >
              <!-- Product Image Placeholder -->
              <div
                class="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <!-- Product Info -->
              <div class="space-y-2">
                <div class="flex items-start justify-between">
                  <h4 class="font-medium text-gray-900 text-sm leading-tight">
                    {{ product.name }}
                  </h4>
                  <button
                    @click="removeItem(product.id)"
                    class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <p class="text-xs text-gray-600 line-clamp-2">
                  {{ product.description || "No description provided" }}
                </p>

                <div class="flex items-center justify-between pt-2">
                  <span class="text-lg font-semibold text-teal-600"
                    >Ksh{{ product.price }}</span
                  >
                  <span
                    class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded"
                    >Qty: {{ product.quantity || "N/A" }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div
              class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              No products yet
            </h3>
            <p class="text-gray-600 text-sm mb-4">
              Add your first product to get started with your store
            </p>
          </div>
        </div>
      </div>

      <!-- Product Listing Sidebar -->
      <div class="w-80 bg-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">
          Product Listing
        </h3>

        <div class="space-y-4">
          <!-- Product Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Product Name</label
            >
            <input
              v-model="productForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Quantity</label
            >
            <input
              v-model="productForm.quantity"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Product Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Product Description</label
            >
            <textarea
              v-model="productForm.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- Product Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Product Image</label
            >
            <div class="flex">
              <input
                type="text"
                placeholder="Choose an image of product to upload"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readonly
              />
              <button
                class="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Product Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Product Price</label
            >
            <input
              v-model="productForm.price"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Add Product Button -->
          <button
            @click="addItem()"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mt-6"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
