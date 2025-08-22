<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { FormField, FormSchema, Store, StoreItem } from "@/types";

// Import existing field components
import DatePickerField from "./Fields/DatePickerField.vue";
import RatingScaleField from "./Fields/RatingScaleField.vue";
import SelectField from "./Fields/SelectField.vue";
import TextAreaField from "./Fields/TextAreaField.vue";
import TextInputField from "./Fields/TextInputField.vue";

// Props
const props = defineProps<{
  form: FormSchema;
  stores?: Store[];
  showHeader?: boolean;
  showStores?: boolean;
}>();

// Emits
const emit = defineEmits<{
  submit: [data: { formData: Record<string, any>; selectedProducts: any[] }];
  pageChange: [pageIndex: number];
  fieldUpdate: [fieldId: string, value: any];
}>();

// Set defaults for optional props
const showHeader = computed(() => props.showHeader !== false);

// Data
const currentPageIndex = ref(0);
const formData = ref<FormField[]>([]);
const errors = ref<Record<string, string>>({});
const selectedProducts = ref<Record<string, boolean>>({});
const productQuantities = ref<Record<string, number>>({});

// Computed
const currentPage = computed(() => props.form.pages[currentPageIndex.value]);

const isCurrentPageValid = computed(() => {
  if (!currentPage.value) return false;

  return currentPage.value.fields.every((field) => {
    if (field.required) {
      const value = formData.value[field.id];
      return value !== undefined && value !== null && value !== "";
    }
    return true;
  });
});

const isFormValid = computed(() => {
  return props.form.pages.every((page) => {
    return page.fields.every((field) => {
      if (field.required) {
        const value = formData.value[field.id];
        return value !== undefined && value !== null && value !== "";
      }
      return true;
    });
  });
});

const selectedProductsList = computed(() => {
  const selected: any[] = [];

  if (props.stores) {
    props.stores.forEach((store) => {
      store.items.forEach((item) => {
        if (selectedProducts.value[item.id]) {
          selected.push({
            ...item,
            storeId: store.id,
            storeName: store.name,
            selectedQuantity: productQuantities.value[item.id] || 1,
          });
        }
      });
    });
  }

  return selected;
});

// Methods
const getFieldComponent = (fieldType: string) => {
  const components = {
    text: TextInputField,
    email: TextInputField,
    phone: TextInputField,
    name: TextInputField,
    longtext: TextAreaField,
    date: DatePickerField,
    rating: RatingScaleField,
    select: SelectField,
  };

  return components[fieldType] || TextInputField;
};

const getFieldColumnClass = (field: any) => {
  if (
    field.type === "name" ||
    field.type === "longtext" ||
    field.type === "rating" ||
    field.type === "file"
  ) {
    return "md:col-span-2";
  }
  return field.columnSpan ? `md:col-span-${field.columnSpan}` : "";
};

const updateField = (fieldId: string, value: any) => {
  formData.value[fieldId] = value;

  // Clear error when field is updated
  if (errors.value[fieldId]) {
    delete errors.value[fieldId];
  }

  emit("fieldUpdate", fieldId, value);
};

const validateField = (field: any): string | null => {
  const value = formData.value[field.id];

  if (
    field.required &&
    (value === undefined || value === null || value === "")
  ) {
    return `${field.label} is required`;
  }

  // Add more validation rules as needed
  if (field.validation) {
    for (const rule of field.validation) {
      switch (rule.type) {
        case "min":
          if (typeof value === "string" && value.length < rule.value) {
            return (
              rule.message ||
              `${field.label} must be at least ${rule.value} characters`
            );
          }
          break;
        case "max":
          if (typeof value === "string" && value.length > rule.value) {
            return (
              rule.message ||
              `${field.label} must be no more than ${rule.value} characters`
            );
          }
          break;
        case "pattern":
          if (
            typeof value === "string" &&
            rule.value &&
            !new RegExp(rule.value).test(value)
          ) {
            return rule.message || `${field.label} format is invalid`;
          }
          break;
      }
    }
  }

  return null;
};

const validateCurrentPage = () => {
  const pageErrors: Record<string, string> = {};

  if (currentPage.value) {
    currentPage.value.fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        pageErrors[field.id] = error;
      }
    });
  }

  errors.value = { ...errors.value, ...pageErrors };
  return Object.keys(pageErrors).length === 0;
};

const nextPage = () => {
  if (
    validateCurrentPage() &&
    currentPageIndex.value < props.form.pages.length - 1
  ) {
    currentPageIndex.value++;
    emit("pageChange", currentPageIndex.value);
  }
};

const previousPage = () => {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--;
    emit("pageChange", currentPageIndex.value);
  }
};

const updateSelectedProducts = (item: StoreItem) => {
  if (selectedProducts.value[item.id]) {
    productQuantities.value[item.id] = 1;
  } else {
    delete productQuantities.value[item.id];
  }
};

const incrementQuantity = (itemId: string) => {
  productQuantities.value[itemId] = (productQuantities.value[itemId] || 1) + 1;
};

const decrementQuantity = (itemId: string) => {
  const current = productQuantities.value[itemId] || 1;
  if (current > 1) {
    productQuantities.value[itemId] = current - 1;
  }
};

const handleSubmit = () => {
  // Validate all pages
  let allValid = true;
  const allErrors: Record<string, string> = {};

  props.form.pages.forEach((page) => {
    page.fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        allErrors[field.id] = error;
        allValid = false;
      }
    });
  });

  errors.value = allErrors;

  if (allValid) {
    emit("submit", {
      formData: formData.value,
      selectedProducts: selectedProductsList.value,
    });
  }
};

// Initialize form data
onMounted(() => {
  props.form.pages.forEach((page) => {
    page.fields.forEach((field) => {
      formData.value.push(field);
    });
  });
});
</script>

<template>
  <div class="form-renderer max-w-4xl mx-auto p-4">
    <!-- Form Header -->
    <div
      v-if="showHeader"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">
        {{ form.title || "Form" }}
      </h1>
      <p v-if="form.description" class="text-gray-600">
        {{ form.description }}
      </p>
    </div>

    <!-- Multi-step Progress (if multiple pages) -->
    <div
      v-if="form.pages.length > 1"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div class="flex items-center justify-center">
        <div class="flex items-center space-x-8">
          <div
            v-for="(page, index) in form.pages"
            :key="page.id"
            class="flex flex-col items-center"
          >
            <div class="flex items-center">
              <!-- Step Circle -->
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                  currentPageIndex > index
                    ? 'bg-green-500 text-white'
                    : currentPageIndex === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600',
                ]"
              >
                {{ index + 1 }}
              </div>

              <!-- Progress Line -->
              <div
                v-if="index < form.pages.length - 1"
                :class="[
                  'h-1 w-20 ml-4',
                  currentPageIndex > index ? 'bg-green-500' : 'bg-gray-200',
                ]"
              ></div>
            </div>

            <!-- Step Info -->
            <div class="mt-3 text-center">
              <div class="text-sm font-medium text-gray-900">
                {{ page.title || `Step ${index + 1}` }}
              </div>
              <div class="text-xs text-gray-500">
                {{ page.fields.length }} fields
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Store Products (if stores are provided) -->
    <div
      v-if="stores && stores.length > 0"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Available Products
      </h2>

      <div class="space-y-6">
        <div v-for="store in stores" :key="store.id">
          <h3 class="text-lg font-medium text-gray-800 mb-4">
            {{ store.name }}
          </h3>

          <div
            v-if="store.items.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="item in store.items"
              :key="item.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
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
              <h4 class="font-medium text-gray-900 text-sm mb-1">
                {{ item.name }}
              </h4>
              <p class="text-xs text-gray-600 mb-2 line-clamp-2">
                {{ item.description || "No description" }}
              </p>

              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-teal-600"
                  >Ksh{{ item.price }}</span
                >
                <span
                  class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded"
                  >Qty: {{ item.quantity }}</span
                >
              </div>

              <!-- Selection controls -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :id="`product-${item.id}`"
                    v-model="selectedProducts[item.id]"
                    @change="updateSelectedProducts(item)"
                    class="mr-2"
                  />
                  <label
                    :for="`product-${item.id}`"
                    class="text-xs text-gray-600"
                    >Select</label
                  >
                </div>

                <div
                  v-if="selectedProducts[item.id]"
                  class="flex items-center gap-2"
                >
                  <button
                    @click="decrementQuantity(item.id)"
                    class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-gray-600 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span class="text-sm">{{
                    productQuantities[item.id] || 1
                  }}</span>
                  <button
                    @click="incrementQuantity(item.id)"
                    class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-gray-600 hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <p class="text-gray-500">No products in this store.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <!-- Current Page -->
      <div v-if="currentPage">
        <div v-if="currentPage.title || currentPage.description" class="mb-6">
          <h2
            v-if="currentPage.title"
            class="text-xl font-semibold text-gray-900 mb-2"
          >
            {{ currentPage.title }}
          </h2>
          <p v-if="currentPage.description" class="text-gray-600">
            {{ currentPage.description }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Fields Grid -->
          <div
            v-if="currentPage.fields.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div
              v-for="field in currentPage.fields"
              :key="field.id"
              :class="getFieldColumnClass(field)"
            >
              <component
                :is="getFieldComponent(field.type)"
                :field="field"
                :model-value="formData[field.id]"
                @update:model-value="updateField(field.id, $event)"
                :preview="false"
              />
              <p v-if="errors[field.id]" class="mt-1 text-sm text-red-600">
                {{ errors[field.id] }}
              </p>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-500">No fields in this page.</p>
          </div>

          <!-- Navigation -->
          <div
            class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
          >
            <button
              v-if="currentPageIndex > 0"
              @click="previousPage"
              type="button"
              class="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <div v-else></div>

            <button
              v-if="currentPageIndex < form.pages.length - 1"
              @click="nextPage"
              type="button"
              :disabled="!isCurrentPageValid"
              :class="[
                'flex items-center gap-2 px-6 py-2 rounded-md transition-colors',
                isCurrentPageValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              Next
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              v-else
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'flex items-center gap-2 px-8 py-3 rounded-md font-medium transition-colors',
                isFormValid
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              {{ form.settings.submitText || "Submit" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
