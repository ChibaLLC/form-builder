<script setup lang="ts">
import { ref, computed, onMounted, type Component } from "vue";
import type { FormSchema, Store, StoreItem, FormField } from "@/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Package,
  Plus,
  Minus,
} from "lucide-vue-next";

import TextInputField from "./Fields/TextInputField.vue";
import TextAreaField from "./Fields/TextAreaField.vue";
import SelectField from "./Fields/SelectField.vue";
import CheckboxField from "./Fields/CheckboxField.vue";
import RadioButtonField from "./Fields/RadioButtonField.vue";
import DatePickerField from "./Fields/DatePickerField.vue";
import RatingScaleField from "./Fields/RatingScaleField.vue";
import FileUploadField from "./Fields/FileUploadField.vue";
import NumberRangeField from "./Fields/NumberRangeField.vue";
import ToggleSwitchField from "./Fields/ToggleSwitchField.vue";

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

const showHeader = computed(() => props.showHeader !== false);
const showStores = computed(() => props.showStores !== false);

const currentStepIndex = ref(0);
const formData = ref<Record<string, any>>({});
const errors = ref<Record<string, string>>({});
const selectedProducts = ref<Record<string, boolean>>({});
const productQuantities = ref<Record<string, number>>({});
const submitted = ref(false);

const totalSteps = computed(() => {
  const formPages = props.form.pages.length;
  const storePages = props.stores?.length || 0;
  return formPages + storePages + 1; // +1 for review page
});

const currentStepType = computed(() => {
  const formPageCount = props.form.pages.length;
  const storePageCount = props.stores?.length || 0;

  if (currentStepIndex.value < formPageCount) {
    return "form";
  } else if (currentStepIndex.value < formPageCount + storePageCount) {
    return "store";
  } else {
    return "review";
  }
});

const currentFormPage = computed(() => {
  if (currentStepType.value === "form") {
    return props.form.pages[currentStepIndex.value];
  }
  return null;
});

const currentStore = computed(() => {
  if (currentStepType.value === "store" && props.stores) {
    const storeIndex = currentStepIndex.value - props.form.pages.length;
    return props.stores[storeIndex];
  }
  return null;
});

const isLastStep = computed(() => {
  return currentStepIndex.value === totalSteps.value - 1;
});

const stepTitle = computed(() => {
  if (currentStepType.value === "form" && currentFormPage.value) {
    return (
      currentFormPage.value.title || `Form Page ${currentStepIndex.value + 1}`
    );
  } else if (currentStepType.value === "store" && currentStore.value) {
    return currentStore.value.name || "Select Products";
  } else if (currentStepType.value === "review") {
    return "Review & Submit";
  }
  return "";
});

const isCurrentStepValid = computed(() => {
  if (currentStepType.value === "form" && currentFormPage.value) {
    return currentFormPage.value.fields.every((field) => {
      if (field.required) {
        const value = formData.value[field.id];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== undefined && value !== null && value !== "";
      }
      return true;
    });
  }
  return true;
});

const isFormValid = computed(() => {
  return props.form.pages.every((page) => {
    return page.fields.every((field) => {
      if (field.required) {
        const value = formData.value[field.id];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
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

const totalAmount = computed(() => {
  return selectedProductsList.value.reduce((total, product) => {
    return total + product.price * product.selectedQuantity;
  }, 0);
});

// Methods
const getStepTitle = (index: number) => {
  const formPageCount = props.form.pages.length;
  const storePageCount = props.stores?.length || 0;

  if (index < formPageCount) {
    return props.form.pages[index].title || `Page ${index + 1}`;
  } else if (index < formPageCount + storePageCount) {
    const storeIndex = index - formPageCount;
    return props.stores?.[storeIndex]?.name || `Store ${storeIndex + 1}`;
  } else {
    return "Review";
  }
};
const getFieldComponent = (fieldType: string): Component => {
  const components: Record<string, Component> = {
    text: TextInputField,
    email: TextInputField,
    phone: TextInputField,
    tel: TextInputField,
    url: TextInputField,
    number: TextInputField,
    password: TextInputField,
    date: DatePickerField,
    time: DatePickerField,
    textarea: TextAreaField,
    longtext: TextAreaField,
    select: SelectField,
    checkbox: CheckboxField,
    radio: RadioButtonField,
    toggle: ToggleSwitchField,
    rating: RatingScaleField,
    file: FileUploadField,
    range: NumberRangeField,
  };

  return components[fieldType] || TextInputField;
};

const updateField = (fieldId: string, value: any) => {
  formData.value[fieldId] = value;

  if (errors.value[fieldId]) {
    delete errors.value[fieldId];
  }

  emit("fieldUpdate", fieldId, value);
};

const validateField = (field: FormField): string | null => {
  const value = formData.value[field.id];

  if (field.required) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${field.label} is required`;
      }
    } else if (value === undefined || value === null || value === "") {
      return `${field.label} is required`;
    }
  }

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

const validateCurrentStep = (): boolean => {
  if (currentStepType.value === "form" && currentFormPage.value) {
    const pageErrors: Record<string, string> = {};
    currentFormPage.value.fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        pageErrors[field.id] = error;
      }
    });
    errors.value = { ...errors.value, ...pageErrors };
    return Object.keys(pageErrors).length === 0;
  }
  return true;
};

const nextStep = () => {
  if (validateCurrentStep() && currentStepIndex.value < totalSteps.value - 1) {
    currentStepIndex.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    submitted.value = true;
    emit("submit", {
      formData: formData.value,
      selectedProducts: selectedProductsList.value,
    });
  }
};

const resetForm = () => {
  formData.value = {};
  errors.value = {};
  selectedProducts.value = {};
  productQuantities.value = {};
  currentStepIndex.value = 0;
  submitted.value = false;

  // Initialize default values
  props.form.pages.forEach((page) => {
    page.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        formData.value[field.id] = field.defaultValue;
      } else if (field.type === "checkbox") {
        formData.value[field.id] = [];
      } else {
        formData.value[field.id] = "";
      }
    });
  });
};

// Initialize form data
onMounted(() => {
  resetForm();
});
</script>

<template>
  <div class="published-form-renderer max-w-4xl mx-auto p-4">
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

    <!-- Multi-step Progress -->
    <div
      v-if="totalSteps > 1"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div class="flex items-center justify-center">
        <div class="flex items-center space-x-8">
          <div
            v-for="(_, index) in totalSteps"
            :key="index"
            class="flex flex-col items-center"
          >
            <div class="flex items-center">
              <!-- Step Circle -->
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  currentStepIndex > index
                    ? 'bg-green-500 text-white'
                    : currentStepIndex === index
                      ? 'bg-green-500 text-white ring-4 ring-green-100'
                      : 'bg-gray-200 text-gray-600',
                ]"
              >
                <Check v-if="currentStepIndex > index" class="w-5 h-5" />
                <span v-else>{{ index + 1 }}</span>
              </div>

              <!-- Progress Line -->
              <div
                v-if="index < totalSteps - 1"
                :class="[
                  'h-1 w-20 ml-4 transition-all',
                  currentStepIndex > index ? 'bg-green-500' : 'bg-gray-200',
                ]"
              ></div>
            </div>

            <!-- Step Info -->
            <div class="mt-3 text-center">
              <div class="text-sm font-medium text-gray-900">
                {{ getStepTitle(index) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <!-- Step Title -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          {{ stepTitle }}
        </h2>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- FORM STEP -->
        <div v-if="currentStepType === 'form' && currentFormPage">
          <!-- Fields Grid -->
          <div v-if="currentFormPage.fields.length > 0" class="space-y-4">
            <div v-for="field in currentFormPage.fields" :key="field.id">
              <component
                :is="getFieldComponent(field.type)"
                :field="field"
                :model-value="formData[field.id]"
                @update:model-value="updateField(field.id, $event)"
                :mode="'fill'"
              />

              <!-- Field Errors -->
              <div v-if="errors[field.id]" class="mt-1">
                <p class="text-sm text-red-600">{{ errors[field.id] }}</p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <p class="text-gray-500">No fields in this page.</p>
          </div>
        </div>

        <!-- STORE STEP -->
        <div v-if="currentStepType === 'store' && currentStore">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in currentStore.items"
              :key="item.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <!-- Product Images -->
              <div v-if="item.images && item.images.length > 0" class="mb-3">
                <img
                  :src="item.images[0]"
                  :alt="item.name"
                  class="w-full h-32 object-cover rounded-lg"
                />
              </div>
              <div
                v-else
                class="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center"
              >
                <Package class="w-8 h-8 text-gray-400" />
              </div>

              <!-- Product Info -->
              <h5 class="font-medium text-gray-900 text-sm mb-1">
                {{ item.name }}
              </h5>
              <p class="text-xs text-gray-600 mb-2 line-clamp-2">
                {{ item.description || "No description" }}
              </p>

              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-green-600">
                  ${{ item.price }}
                </span>
                <span
                  class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded"
                >
                  Stock: {{ item.quantity }}
                </span>
              </div>

              <!-- Selection controls -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :id="`product-${currentStepIndex}-${item.id}`"
                    v-model="selectedProducts[item.id]"
                    @change="updateSelectedProducts(item)"
                    class="mr-2 w-4 h-4 text-green-500 rounded focus:ring-2 focus:ring-green-200"
                  />
                  <label
                    :for="`product-${currentStepIndex}-${item.id}`"
                    class="text-xs text-gray-600 cursor-pointer"
                    >Select</label
                  >
                </div>

                <div
                  v-if="selectedProducts[item.id]"
                  class="flex items-center gap-2"
                >
                  <button
                    type="button"
                    @click="decrementQuantity(item.id)"
                    class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition-colors"
                  >
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="text-sm font-medium">{{
                    productQuantities[item.id] || 1
                  }}</span>
                  <button
                    type="button"
                    @click="incrementQuantity(item.id)"
                    class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition-colors"
                  >
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- REVIEW STEP -->
        <div v-if="currentStepType === 'review'">
          <!-- Form Data Review -->
          <div v-if="Object.keys(formData).length > 0">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Form Details
            </h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div v-for="(page, pageIndex) in form.pages" :key="pageIndex">
                <h4 class="font-medium text-gray-800 mb-2">{{ page.title }}</h4>
                <ul>
                  <li
                    v-for="(field, fieldIndex) in page.fields"
                    :key="fieldIndex"
                    class="text-sm text-gray-600"
                  >
                    <strong>{{ field.label }}:</strong> {{ formData[field.id] }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Selected Products Review -->
          <div v-if="selectedProductsList.length > 0" class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Selected Products
            </h3>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div
                v-for="(product, index) in selectedProductsList"
                :key="index"
                class="text-sm text-gray-600"
              >
                <strong
                  >{{ product.name }} ({{ product.selectedQuantity }}x)</strong
                >
                - ${{ (product.price * product.selectedQuantity).toFixed(2) }}
              </div>
              <div class="border-t border-gray-200 mt-4 pt-4 font-bold">
                Total: ${{ totalAmount.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div
          class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
        >
          <button
            v-if="currentStepIndex > 0"
            @click="previousStep"
            type="button"
            class="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft class="w-4 h-4" />
            Previous
          </button>
          <div v-else></div>

          <button
            v-if="!isLastStep"
            @click="nextStep"
            type="button"
            :disabled="!isCurrentStepValid"
            :class="[
              'flex items-center gap-2 px-6 py-2 rounded-lg transition-colors',
              isCurrentStepValid
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            Next
            <ChevronRight class="w-4 h-4" />
          </button>

          <button
            v-if="isLastStep"
            type="submit"
            :disabled="!isFormValid"
            :class="[
              'flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors',
              isFormValid
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            <Send class="w-4 h-4" />
            {{ form.settings?.submitText || "Submit Form" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Success Message -->
    <div
      v-if="submitted"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg p-8 max-w-md mx-4">
        <div class="flex flex-col items-center">
          <div
            class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <Check class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Form Submitted Successfully!
          </h3>
          <p class="text-gray-600 text-center mb-6">
            {{
              form.settings?.successMessage ||
              "Thank you for your submission. We'll get back to you soon."
            }}
          </p>
          <button
            @click="resetForm"
            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
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
