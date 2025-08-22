<script setup lang="ts">
import { ref, computed, onMounted, nextTick, type Component } from "vue";
import type { FormSchema, Store, StoreItem, FormField } from "@/types";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  Package,
  Plus,
  Minus,
  AlertCircle,
  Info,
  Sparkles,
  Clock,
  User,
  ShoppingCart,
  CheckCircle2,
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

// Interface for storing field with its value
interface FormFieldWithValue extends FormField {
  value?: any;
}

const props = withDefaults(
  defineProps<{
    form: FormSchema;
    stores?: Store[];
    showHeader?: boolean;
    showStores?: boolean;
  }>(),
  {
    showHeader: true,
  },
);

// Emits
const emit = defineEmits<{
  submit: [data: { formData: FormFieldWithValue[]; selectedProducts: any[] }];
  pageChange: [pageIndex: number];
  fieldUpdate: [fieldId: string, value: any];
}>();

const currentStepIndex = ref(0);
const formData = ref<FormFieldWithValue[]>([]);
const errors = ref<Record<string, string>>({});
const selectedProducts = ref<Record<string, boolean>>({});
const productQuantities = ref<Record<string, number>>({});
const submitted = ref(false);
const isSubmitting = ref(false);
const showFieldFocus = ref<string | null>(null);

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
    return currentFormPage.value.title || `Step ${currentStepIndex.value + 1}`;
  } else if (currentStepType.value === "store" && currentStore.value) {
    return currentStore.value.name || "Select Products";
  } else if (currentStepType.value === "review") {
    return "Review & Submit";
  }
  return "";
});

const stepDescription = computed(() => {
  if (currentStepType.value === "form" && currentFormPage.value) {
    return currentFormPage.value.description;
  } else if (currentStepType.value === "store" && currentStore.value) {
    return "Choose the products you'd like to add to your order";
  } else if (currentStepType.value === "review") {
    return "Please review your information before submitting";
  }
  return "";
});

const progressPercentage = computed(() => {
  return Math.round(((currentStepIndex.value + 1) / totalSteps.value) * 100);
});

const isCurrentStepValid = computed(() => {
  if (currentStepType.value === "form" && currentFormPage.value) {
    return currentFormPage.value.fields.every((field) => {
      if (field.required) {
        const fieldData = getFieldData(field.id);
        const value = fieldData?.value;
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
        const fieldData = getFieldData(field.id);
        const value = fieldData?.value;
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== undefined && value !== null && value !== "";
      }
      return true;
    });
  });
});

const completedSteps = computed(() => {
  let completed = 0;

  // Check form pages
  props.form.pages.forEach((page, index) => {
    if (index < currentStepIndex.value) {
      const pageValid = page.fields.every((field) => {
        if (field.required) {
          const fieldData = getFieldData(field.id);
          const value = fieldData?.value;
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          return value !== undefined && value !== null && value !== "";
        }
        return true;
      });
      if (pageValid) completed++;
    }
  });

  // Add store steps if passed
  if (currentStepIndex.value > props.form.pages.length) {
    completed += Math.min(
      currentStepIndex.value - props.form.pages.length,
      props.stores?.length || 0,
    );
  }

  return completed;
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

// Helper function to get field data by ID
const getFieldData = (fieldId: string): FormFieldWithValue | undefined => {
  return formData.value.find((field) => field.id === fieldId);
};

// Helper function to get field value by ID
const getFieldValue = (fieldId: string): any => {
  return getFieldData(fieldId)?.value;
};

// Methods
const getStepTitle = (index: number) => {
  const formPageCount = props.form.pages.length;
  const storePageCount = props.stores?.length || 0;

  if (index < formPageCount) {
    return props.form.pages[index].title || `Step ${index + 1}`;
  } else if (index < formPageCount + storePageCount) {
    const storeIndex = index - formPageCount;
    return props.stores?.[storeIndex]?.name || `Store ${storeIndex + 1}`;
  } else {
    return "Review";
  }
};

const getStepIcon = (index: number) => {
  const formPageCount = props.form.pages.length;
  const storePageCount = props.stores?.length || 0;

  if (index < formPageCount) {
    return User;
  } else if (index < formPageCount + storePageCount) {
    return ShoppingCart;
  } else {
    return CheckCircle2;
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
  const fieldIndex = formData.value.findIndex((field) => field.id === fieldId);

  if (fieldIndex !== -1) {
    // Update existing field value
    formData.value[fieldIndex].value = value;
  } else {
    console.warn(`Field with ID ${fieldId} not found in formData`);
  }

  if (errors.value[fieldId]) {
    delete errors.value[fieldId];
  }

  emit("fieldUpdate", fieldId, value);
};

const validateField = (field: FormField): string | null => {
  const value = getFieldValue(field.id);

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

const nextStep = async () => {
  if (validateCurrentStep() && currentStepIndex.value < totalSteps.value - 1) {
    // Add smooth transition effect
    const container = document.querySelector(".form-container");
    if (container) {
      container.classList.add("opacity-90", "scale-[0.98]");
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    currentStepIndex.value++;

    await nextTick();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (container) {
      container.classList.remove("opacity-90", "scale-[0.98]");
    }
  }
};

const previousStep = async () => {
  if (currentStepIndex.value > 0) {
    const container = document.querySelector(".form-container");
    if (container) {
      container.classList.add("opacity-90", "scale-[0.98]");
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    currentStepIndex.value--;

    await nextTick();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (container) {
      container.classList.remove("opacity-90", "scale-[0.98]");
    }
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

const handleSubmit = async () => {
  isSubmitting.value = true;

  // Validate all form fields
  let allValid = true;
  const allErrors: Record<string, string> = {};

  formData.value.forEach((fieldData) => {
    const error = validateField(fieldData);
    if (error) {
      allErrors[fieldData.id] = error;
      allValid = false;
    }
  });

  errors.value = allErrors;

  if (allValid) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create a deep copy of formData to avoid reference issues
    const formDataCopy = formData.value.map((field) => ({ ...field }));

    emit("submit", {
      formData: formDataCopy,
      selectedProducts: selectedProductsList.value,
    });

    submitted.value = true;
  }

  isSubmitting.value = false;
};

const resetForm = () => {
  errors.value = {};
  selectedProducts.value = {};
  productQuantities.value = {};
  currentStepIndex.value = 0;
  submitted.value = false;
  isSubmitting.value = false;

  // Initialize formData with complete field objects
  formData.value = [];
  props.form.pages.forEach((page) => {
    page.fields.forEach((field) => {
      const fieldWithValue: FormFieldWithValue = {
        ...field, // Copy all field properties
        value: getInitialFieldValue(field), // Set initial value
      };
      formData.value.push(fieldWithValue);
    });
  });
};

const getInitialFieldValue = (field: FormField): any => {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  switch (field.type) {
    case "checkbox":
      return field.options ? [] : false;
    case "radio":
    case "select":
      return "";
    case "number":
    case "range":
      return 0;
    case "toggle":
      return false;
    case "file":
      return null;
    default:
      return "";
  }
};

// Initialize form data
onMounted(() => {
  resetForm();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Form Header -->
      <div
        v-if="showHeader"
        class="text-center mb-8 animate-in fade-in slide-in-from-top duration-700"
      >
        <div class="relative">
          <div
            class="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-green-500 rounded-full"
          ></div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            {{ form.title || "Form" }}
          </h1>
          <p
            v-if="form.description"
            class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            {{ form.description }}
          </p>
        </div>
      </div>

      <!-- Clean Progress Bar -->
      <div
        v-if="totalSteps > 1"
        class="mb-8 animate-in fade-in slide-in-from-top duration-700 delay-200"
      >
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <!-- Progress Stats -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 bg-green-500 rounded-lg text-white"
              >
                <Sparkles class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">Progress</h3>
                <p class="text-sm text-gray-600">
                  Step {{ currentStepIndex + 1 }} of {{ totalSteps }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600">
                {{ progressPercentage }}%
              </div>
              <div class="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="relative">
            <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-green-500 rounded-full transition-all duration-700 ease-out"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Step Indicators -->
          <div
            class="flex items-center justify-between mt-6 overflow-x-auto pb-2"
          >
            <div
              v-for="(_, index) in totalSteps"
              :key="index"
              class="flex flex-col items-center min-w-0 flex-1"
            >
              <div class="flex items-center w-full">
                <!-- Step Circle -->
                <div
                  :class="[
                    'relative w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-300 mx-auto',
                    currentStepIndex > index
                      ? 'bg-green-500 text-white shadow-md scale-110'
                      : currentStepIndex === index
                        ? 'bg-green-500 text-white shadow-md scale-110 ring-4 ring-green-100'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200',
                  ]"
                >
                  <Check v-if="currentStepIndex > index" class="w-5 h-5" />
                  <component
                    v-else-if="currentStepIndex === index"
                    :is="getStepIcon(index)"
                    class="w-5 h-5"
                  />
                  <span v-else>{{ index + 1 }}</span>

                  <!-- Connecting Line -->
                  <div
                    v-if="index < totalSteps - 1"
                    :class="[
                      'absolute left-full top-1/2 -translate-y-1/2 h-1 transition-all duration-500',
                      'w-8 sm:w-12 md:w-16 lg:w-20',
                      currentStepIndex > index ? 'bg-green-500' : 'bg-gray-200',
                    ]"
                  ></div>
                </div>
              </div>

              <!-- Step Info -->
              <div class="mt-3 text-center">
                <div
                  class="text-xs font-medium text-gray-700 truncate max-w-20"
                >
                  {{ getStepTitle(index) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="form-container transition-all duration-300 ease-in-out">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Step Header -->
          <div class="bg-green-500 p-6 text-white">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"
              >
                <component
                  :is="getStepIcon(currentStepIndex)"
                  class="w-6 h-6"
                />
              </div>
              <div>
                <h2 class="text-2xl font-bold mb-1">{{ stepTitle }}</h2>
                <p v-if="stepDescription" class="text-green-100 text-sm">
                  {{ stepDescription }}
                </p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="p-8">
            <!-- FORM STEP -->
            <div
              v-if="currentStepType === 'form' && currentFormPage"
              class="animate-in fade-in slide-in-from-right duration-500"
            >
              <div v-if="currentFormPage.fields.length > 0" class="space-y-6">
                <div
                  v-for="(field, index) in currentFormPage.fields"
                  :key="field.id"
                  class="group animate-in fade-in slide-in-from-left duration-500"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <div class="relative">
                    <component
                      :is="getFieldComponent(field.type)"
                      :field="field"
                      :model-value="getFieldValue(field.id)"
                      @update:model-value="updateField(field.id, $event)"
                      :mode="'fill'"
                      @focus="showFieldFocus = field.id"
                      @blur="showFieldFocus = null"
                      :class="[
                        'transition-all duration-300',
                        showFieldFocus === field.id
                          ? 'scale-[1.01] shadow-lg ring-2 ring-green-200'
                          : '',
                        errors[field.id] ? 'animate-pulse' : '',
                      ]"
                    />

                    <!-- Field Errors -->
                    <Transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 scale-95 -translate-y-2"
                      enter-to-class="opacity-100 scale-100 translate-y-0"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 scale-100 translate-y-0"
                      leave-to-class="opacity-0 scale-95 -translate-y-2"
                    >
                      <div
                        v-if="errors[field.id]"
                        class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div class="flex items-center gap-2 text-red-700">
                          <AlertCircle class="w-4 h-4 flex-shrink-0" />
                          <p class="text-sm font-medium">
                            {{ errors[field.id] }}
                          </p>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-16">
                <div
                  class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Info class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-gray-500 text-lg">No fields in this page.</p>
              </div>
            </div>

            <!-- STORE STEP -->
            <div
              v-if="currentStepType === 'store' && currentStore"
              class="animate-in fade-in slide-in-from-right duration-500"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(item, index) in currentStore.items"
                  :key="item.id"
                  class="group relative bg-white rounded-lg border-2 hover:border-green-300 hover:shadow-lg transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom"
                  :style="{ animationDelay: `${index * 100}ms` }"
                  :class="
                    selectedProducts[item.id]
                      ? 'border-green-400 shadow-md'
                      : 'border-gray-200'
                  "
                >
                  <!-- Product Images -->
                  <div class="relative overflow-hidden">
                    <div
                      v-if="item.images && item.images.length > 0"
                      class="aspect-square"
                    >
                      <img
                        :src="item.images[0]"
                        :alt="item.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div
                      v-else
                      class="aspect-square bg-gray-100 flex items-center justify-center"
                    >
                      <Package class="w-12 h-12 text-gray-400" />
                    </div>

                    <!-- Selection Badge -->
                    <Transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 scale-0"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-0"
                    >
                      <div
                        v-if="selectedProducts[item.id]"
                        class="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md"
                      >
                        <Check class="w-4 h-4 text-white" />
                      </div>
                    </Transition>
                  </div>

                  <div class="p-4">
                    <!-- Product Info -->
                    <h5
                      class="font-semibold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors"
                    >
                      {{ item.name }}
                    </h5>
                    <p
                      class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed"
                    >
                      {{ item.description || "No description available" }}
                    </p>

                    <div class="flex items-center justify-between mb-4">
                      <span class="text-xl font-bold text-green-600">
                        ${{ item.price.toFixed(2) }}
                      </span>
                      <span
                        class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        Stock: {{ item.quantity }}
                      </span>
                    </div>

                    <!-- Selection controls -->
                    <div class="flex items-center justify-between">
                      <label
                        class="flex items-center gap-3 cursor-pointer group/checkbox"
                      >
                        <input
                          type="checkbox"
                          :id="`product-${currentStepIndex}-${item.id}`"
                          v-model="selectedProducts[item.id]"
                          @change="updateSelectedProducts(item)"
                          class="sr-only"
                        />
                        <div
                          :class="[
                            'w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center',
                            selectedProducts[item.id]
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 group-hover/checkbox:border-green-400',
                          ]"
                        >
                          <Check
                            v-if="selectedProducts[item.id]"
                            class="w-3 h-3 text-white"
                          />
                        </div>
                        <span
                          class="text-sm font-medium text-gray-700 group-hover/checkbox:text-green-600 transition-colors"
                        >
                          Select Item
                        </span>
                      </label>

                      <Transition
                        enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 scale-0"
                        enter-to-class="opacity-100 scale-100"
                        leave-active-class="transition-all duration-200 ease-in"
                        leave-from-class="opacity-100 scale-100"
                        leave-to-class="opacity-0 scale-0"
                      >
                        <div
                          v-if="selectedProducts[item.id]"
                          class="flex items-center gap-2 bg-gray-100 rounded-lg p-1"
                        >
                          <button
                            type="button"
                            @click="decrementQuantity(item.id)"
                            class="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-all duration-200 shadow-sm"
                          >
                            <Minus class="w-4 h-4" />
                          </button>
                          <span
                            class="text-sm font-semibold text-gray-900 min-w-[2rem] text-center"
                            >{{ productQuantities[item.id] || 1 }}</span
                          >
                          <button
                            type="button"
                            @click="incrementQuantity(item.id)"
                            class="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-all duration-200 shadow-sm"
                          >
                            <Plus class="w-4 h-4" />
                          </button>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selected Products Summary -->
              <Transition
                enter-active-class="transition-all duration-500 ease-out"
                enter-from-class="opacity-0 scale-95 translate-y-4"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-4"
              >
                <div
                  v-if="selectedProductsList.length > 0"
                  class="mt-8 p-6 bg-green-50 rounded-xl border border-green-200"
                >
                  <h4
                    class="font-semibold text-gray-900 mb-3 flex items-center gap-2"
                  >
                    <ShoppingCart class="w-5 h-5 text-green-600" />
                    Selected Items ({{ selectedProductsList.length }})
                  </h4>
                  <div class="space-y-2 mb-4">
                    <div
                      v-for="product in selectedProductsList"
                      :key="product.id"
                      class="flex justify-between items-center text-sm bg-white rounded-lg p-3 border border-green-100"
                    >
                      <span class="font-medium text-gray-700">{{
                        product.name
                      }}</span>
                      <span class="text-gray-600"
                        >{{ product.selectedQuantity }}x ${{
                          product.price.toFixed(2)
                        }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="flex justify-between items-center pt-3 border-t border-green-200"
                  >
                    <span class="font-semibold text-gray-900">Total:</span>
                    <span class="text-xl font-bold text-green-600"
                      >Ksh {{ totalAmount.toFixed(2) }}</span
                    >
                  </div>
                </div>
              </Transition>
            </div>

            <!-- REVIEW STEP -->
            <div
              v-if="currentStepType === 'review'"
              class="animate-in fade-in slide-in-from-right duration-500"
            >
              <div class="space-y-8">
                <!-- Form Data Review -->
                <div v-if="formData.length > 0">
                  <div class="flex items-center gap-3 mb-6">
                    <div
                      class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
                    >
                      <User class="w-5 h-5 text-white" />
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900">
                      Your Information
                    </h3>
                  </div>

                  <div class="space-y-6">
                    <div
                      v-for="(page, pageIndex) in form.pages"
                      :key="pageIndex"
                      class="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <h4
                        class="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2"
                      >
                        <div
                          class="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center"
                        >
                          <span class="text-xs font-bold text-green-600">{{
                            pageIndex + 1
                          }}</span>
                        </div>
                        {{ page.title }}
                      </h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          v-for="field in page.fields"
                          :key="field.id"
                          class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-all duration-200"
                        >
                          <div class="flex justify-between items-start gap-3">
                            <span class="text-sm font-medium text-gray-600"
                              >{{ field.label }}:</span
                            >
                            <span
                              class="text-sm text-gray-900 font-medium text-right flex-1"
                            >
                              {{ getFieldValue(field.id) || "Not provided" }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Selected Products Review -->
                <div v-if="selectedProductsList.length > 0">
                  <div class="flex items-center gap-3 mb-6">
                    <div
                      class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
                    >
                      <ShoppingCart class="w-5 h-5 text-white" />
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900">
                      Order Summary
                    </h3>
                  </div>

                  <div
                    class="bg-green-50 rounded-xl p-6 border border-green-200"
                  >
                    <div class="space-y-4 mb-6">
                      <div
                        v-for="(product, index) in selectedProductsList"
                        :key="index"
                        class="flex justify-between items-center bg-white rounded-lg p-4 border border-green-100 hover:shadow-sm transition-all duration-200"
                      >
                        <div class="flex items-center gap-4">
                          <div
                            class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
                          >
                            <Package class="w-6 h-6 text-gray-500" />
                          </div>
                          <div>
                            <h5 class="font-semibold text-gray-900">
                              {{ product.name }}
                            </h5>
                            <p class="text-sm text-gray-600">
                              {{ product.storeName }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-lg font-semibold text-gray-900">
                            ${{
                              (
                                product.price * product.selectedQuantity
                              ).toFixed(2)
                            }}
                          </div>
                          <div class="text-sm text-gray-600">
                            {{ product.selectedQuantity }}x ${{
                              product.price.toFixed(2)
                            }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="flex justify-between items-center pt-6 border-t-2 border-green-200"
                    >
                      <span class="text-xl font-bold text-gray-900"
                        >Total Amount:</span
                      >
                      <span class="text-2xl font-bold text-green-600"
                        >${{ totalAmount.toFixed(2) }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Confirmation Notice -->
                <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div class="flex items-start gap-4">
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <Info class="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">
                        Ready to Submit
                      </h4>
                      <p class="text-sm text-gray-600 leading-relaxed">
                        Please review all the information above carefully. Once
                        you submit this form, you'll receive a confirmation
                        email with your details and next steps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Clean Navigation -->
            <div
              class="flex justify-between items-center mt-12 pt-8 border-t border-gray-200"
            >
              <button
                v-if="currentStepIndex > 0"
                @click="previousStep"
                type="button"
                class="group flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
              >
                <ChevronLeft
                  class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                />
                <span class="font-medium">Previous</span>
              </button>
              <div v-else></div>

              <button
                v-if="!isLastStep"
                @click="nextStep"
                type="button"
                :disabled="!isCurrentStepValid"
                :class="[
                  'group flex items-center gap-3 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg',
                  isCurrentStepValid
                    ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none',
                ]"
              >
                <span>Next Step</span>
                <ChevronRight
                  class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>

              <button
                v-if="isLastStep"
                type="submit"
                :disabled="!isFormValid || isSubmitting"
                :class="[
                  'group flex items-center gap-3 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg',
                  isFormValid && !isSubmitting
                    ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none',
                ]"
              >
                <div
                  v-if="isSubmitting"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></div>
                <Send
                  v-else
                  class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
                />
                <span>{{
                  isSubmitting
                    ? "Submitting..."
                    : form.settings?.submitText || "Submit Form"
                }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Clean Success Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="submitted"
        class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      >
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-90"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-90"
        >
          <div
            class="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-xl border border-gray-200"
          >
            <div class="text-center">
              <!-- Success Animation -->
              <div class="relative mb-6">
                <div
                  class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce"
                >
                  <CheckCircle2 class="w-10 h-10 text-white" />
                </div>
                <div
                  class="absolute inset-0 w-20 h-20 bg-green-400/20 rounded-full mx-auto animate-ping"
                ></div>
              </div>

              <h3 class="text-2xl font-bold text-gray-900 mb-3">🎉 Success!</h3>
              <h4 class="text-xl font-semibold text-gray-800 mb-4">
                Form Submitted Successfully!
              </h4>
              <p class="text-gray-600 leading-relaxed mb-8">
                {{
                  form.settings?.successMessage ||
                  "Thank you for your submission! We've received your information and will get back to you soon."
                }}
              </p>

              <div class="space-y-3">
                <button
                  @click="resetForm"
                  class="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                >
                  Submit Another Response
                </button>
                <p class="text-xs text-gray-500">
                  You'll receive a confirmation email shortly
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: animate-in 0.6s ease-out forwards;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #22c55e;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #16a34a;
}

/* Focus styles for better accessibility */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
</style>
