<script setup lang="ts">
import { useStoreDrag } from "../../composables/drag";
import type { Store, StoreItem } from "@/types";
import { ref, watch } from "vue";
import { ShoppingBag, Plus, Trash2, Package, Upload, X, Image as ImageIcon, Edit2 } from 'lucide-vue-next';

const stores = ref<Store[]>([]);
const activeStore = ref<Store>({} as Store);
const editingItem = ref<StoreItem | null>(null);
const showProductForm = ref(false);
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

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

// Emits to parent component
const emit = defineEmits<{
  'update-stores': [stores: Store[]]
}>();

// Watch stores and emit updates to parent
watch(stores, (newStores) => {
  emit('update-stores', newStores);
}, { deep: true });

// Image handling
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    imageFiles.value.push(...files);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value.push(e.target?.result as string);
        productForm.value.images.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
};

const removeImage = (index: number) => {
  imagePreviews.value.splice(index, 1);
  productForm.value.images.splice(index, 1);
  imageFiles.value.splice(index, 1);
};

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

if (stores.value.length === 0) {
  addNewStore();
}

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

const openProductForm = (item?: StoreItem) => {
  if (item) {
    editingItem.value = item;
    productForm.value = { ...item };
    imagePreviews.value = [...(item.images || [])];
  } else {
    editingItem.value = null;
    resetProductForm();
  }
  showProductForm.value = true;
};

const resetProductForm = () => {
  productForm.value = {
    id: Date.now().toString(),
    name: "",
    description: "",
    price: 0,
    images: [] as string[],
    infinite: false,
    quantity: 0,
  };
  imageFiles.value = [];
  imagePreviews.value = [];
};

const saveProduct = () => {
  if (!productForm.value.name || productForm.value.price <= 0) {
    alert("Please fill in all required fields");
    return;
  }

  if (editingItem.value) {
    // Update existing item
    const index = activeStore.value.items.findIndex(item => item.id === editingItem.value?.id);
    if (index > -1) {
      activeStore.value.items[index] = { ...productForm.value };
    }
  } else {
    // Add new item
    activeStore.value.items.push({ ...productForm.value });
  }

  showProductForm.value = false;
  resetProductForm();
};

const removeItem = (itemId: string) => {
  if (activeStore.value && confirm("Are you sure you want to delete this product?")) {
    const index = activeStore.value.items.findIndex((p) => p.id === itemId);
    if (index > -1) {
      activeStore.value.items.splice(index, 1);
    }
  }
};

const editProduct = (product: StoreItem) => {
  openProductForm(product);
};

const clearAllProducts = () => {
  if (confirm("Are you sure you want to remove all products from this store?")) {
    activeStore.value.items = [];
  }
};

const clearActiveStore = () => {
  if (confirm("Are you sure you want to clear this store?")) {
    activeStore.value.items = [];
    activeStore.value.name = `Store ${activeStore.value.id}`;
    activeStore.value.description = "";
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
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                Products
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ activeStore.items.length }} {{ activeStore.items.length === 1 ? 'product' : 'products' }} in this store
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="activeStore.items.length > 0"
                @click="clearAllProducts"
                class="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300 rounded-lg transition-all"
              >
                Clear All
              </button>
            </div>
          </div>

          <!-- Products Grid -->
          <div
            v-if="activeStore.items.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            <div
              v-for="product in activeStore.items"
              :key="product.id"
              class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
            >
              <!-- Product Image -->
              <div class="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <!-- Multiple Images Display -->
                <div v-if="product.images && product.images.length > 0" class="relative w-full h-full">
                  <img
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                  <!-- Image counter badge -->
                  <div v-if="product.images.length > 1" class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    +{{ product.images.length - 1 }} more
                  </div>
                </div>
                <!-- Default placeholder when no images -->
                <div v-else class="w-full h-full flex items-center justify-center">
                  <div class="text-center">
                    <Package class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p class="text-xs text-gray-500">No image</p>
                  </div>
                </div>
                
                <!-- Stock Badge -->
                <div class="absolute top-2 left-2">
                  <span v-if="product.infinite" class="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    In Stock
                  </span>
                  <span v-else-if="product.quantity > 0" class="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                    {{ product.quantity }} left
                  </span>
                  <span v-else class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    Out of Stock
                  </span>
                </div>

                <!-- Quick Actions -->
                <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="editProduct(product)"
                    class="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors"
                    title="Edit product"
                  >
                    <Edit2 class="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    @click="removeItem(product.id)"
                    class="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 class="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-4">
                <!-- Name and Price -->
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 text-base line-clamp-1">
                      {{ product.name }}
                    </h4>
                    <p class="text-sm text-gray-500 line-clamp-2 mt-1">
                      {{ product.description || "No description" }}
                    </p>
                  </div>
                </div>

                <!-- Price and Details -->
                <div class="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Price</p>
                    <p class="text-xl font-bold text-green-600">
                      ${{ product.price.toFixed(2) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500 mb-1">SKU</p>
                    <p class="text-sm font-mono text-gray-700">
                      #{{ product.id.slice(0, 8).toUpperCase() }}
                    </p>
                  </div>
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

      <!-- Product Form Sidebar -->
      <div class="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            Add Product
          </h3>
          <button
            @click="openProductForm()"
            class="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-5">
          <!-- Product Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="productForm.name"
              type="text"
              placeholder="Enter product name"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <!-- Product Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              v-model="productForm.description"
              rows="3"
              placeholder="Describe your product"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- Price and Quantity -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Price <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  v-model.number="productForm.price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                v-model.number="productForm.quantity"
                type="number"
                placeholder="0"
                :disabled="productForm.infinite"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <!-- Infinite Stock Toggle -->
          <div>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="productForm.infinite"
                type="checkbox"
                class="sr-only"
              />
              <div class="relative">
                <div :class="[
                  'block w-10 h-6 rounded-full transition-colors',
                  productForm.infinite ? 'bg-green-500' : 'bg-gray-300'
                ]"></div>
                <div :class="[
                  'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
                  productForm.infinite ? 'translate-x-4' : ''
                ]"></div>
              </div>
              <span class="ml-3 text-sm text-gray-700">Unlimited stock</span>
            </label>
          </div>

          <!-- Product Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            
            <!-- Image Upload Area -->
            <div class="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
                ref="imageInput"
              />
              <button
                @click="$refs.imageInput.click()"
                class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-400 transition-colors group"
              >
                <div class="text-center">
                  <Upload class="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-green-500" />
                  <p class="text-sm text-gray-600">Click to upload images</p>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </button>
            </div>

            <!-- Image Previews -->
            <div v-if="imagePreviews.length > 0" class="mt-3 grid grid-cols-3 gap-2">
              <div
                v-for="(image, index) in imagePreviews"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image"
                  alt="Product image"
                  class="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X class="w-3 h-3" />
                </button>
                <div v-if="index === 0" class="absolute bottom-1 left-1 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded">
                  Main
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              @click="resetProductForm"
              class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveProduct"
              class="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              {{ editingItem ? 'Update' : 'Add' }} Product
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
