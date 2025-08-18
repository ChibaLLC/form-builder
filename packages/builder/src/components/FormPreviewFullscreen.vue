<script setup lang="ts">
import { ref, computed } from "vue";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingCart,
  Package,
} from "lucide-vue-next";
// Import field components directly
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
import type { FormSchema, Store as StoreType } from "@/types";

interface Props {
  form: FormSchema;
  stores?: StoreType[];
}

const props = withDefaults(defineProps<Props>(), {
  stores: () => [],
});

const emit = defineEmits<{
  close: [];
}>();

// State
const currentStep = ref(0);
const formData = ref<Record<string, any>>({});

// Computed
const totalSteps = computed(() => {
  let steps = props.form.pages.length;
  if (props.stores && props.stores.length > 0) {
    steps += 1; // Add store step
  }
  return steps;
});

const isStorePage = computed(() => {
  return currentStep.value >= props.form.pages.length;
});

const currentPage = computed(() => {
  if (isStorePage.value) return null;
  return props.form.pages[currentStep.value];
});

const stepperItems = computed(() => {
  const items = props.form.pages.map((page, index) => ({
    id: `page-${page.id}`,
    title: page.title || `Step ${index + 1}`,
    description: page.description,
    completed: currentStep.value > index,
    active: currentStep.value === index,
  }));

  if (props.stores && props.stores.length > 0) {
    items.push({
      id: "store",
      title: "Products",
      description: "Select products",
      completed: false,
      active: isStorePage.value,
    });
  }

  return items;
});

const progress = computed(() => {
  return ((currentStep.value + 1) / totalSteps.value) * 100;
});

// Methods
function nextStep() {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function goToStep(index: number) {
  currentStep.value = index;
}

function handleSubmit() {
  console.log("Form submitted:", formData.value);
  emit("close");
}

function getFieldComponent(fieldType: string) {
  const components: Record<string, any> = {
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
}
</script>

<template>
  <div class="fixed inset-0 z-50 bg-white flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Form Title -->
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ form.title }}</h1>
            <p class="text-sm text-gray-500">{{ form.description }}</p>
          </div>

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 h-1">
        <div
          class="bg-green-500 h-1 transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </header>

    <!-- Stepper -->
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div
            v-for="(item, index) in stepperItems"
            :key="item.id"
            class="flex-1 flex items-center"
          >
            <!-- Step -->
            <button
              @click="goToStep(index)"
              class="flex items-center group"
              :disabled="index > currentStep"
            >
              <!-- Step Number/Icon -->
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                  item.completed
                    ? 'bg-green-500 text-white'
                    : item.active
                      ? 'bg-green-500 text-white ring-4 ring-green-100'
                      : 'bg-gray-200 text-gray-500',
                ]"
              >
                <Check v-if="item.completed" class="w-5 h-5" />
                <ShoppingCart v-else-if="item.id === 'store'" class="w-5 h-5" />
                <span v-else>{{ index + 1 }}</span>
              </div>

              <!-- Step Info -->
              <div class="ml-3 text-left">
                <p
                  :class="[
                    'text-sm font-medium',
                    item.active ? 'text-gray-900' : 'text-gray-500',
                  ]"
                >
                  {{ item.title }}
                </p>
                <p class="text-xs text-gray-400">{{ item.description }}</p>
              </div>
            </button>

            <!-- Connector -->
            <div v-if="index < stepperItems.length - 1" class="flex-1 mx-4">
              <div
                :class="[
                  'h-0.5 transition-all',
                  item.completed ? 'bg-green-500' : 'bg-gray-200',
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      class="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Form Page -->
        <div v-if="currentPage" class="bg-white rounded-2xl shadow-xl">
          <!-- Page Header with gradient -->
          <div
            class="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl px-8 py-10 text-white"
          >
            <h2 class="text-3xl font-bold mb-2">
              {{ currentPage.title }}
            </h2>
            <p class="text-green-100 text-lg">
              {{ currentPage.description }}
            </p>
          </div>
          <!-- Form Fields Container -->
          <div class="p-8 md:p-12">
            <div
              v-if="currentPage.fields.length === 0"
              class="text-center py-16"
            >
              <div
                class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <span class="text-4xl">📝</span>
              </div>
              <p class="text-gray-500 text-lg">
                No fields added to this page yet
              </p>
              <p class="text-gray-400 text-sm mt-2">
                Add some fields in the form builder
              </p>
            </div>

            <!-- Responsive Form Grid using reusable field components -->
            <div v-else class="space-y-4">
              <component
                v-for="field in currentPage.fields"
                :key="field.id"
                :is="getFieldComponent(field.type)"
                :field="field"
                :mode="'preview'"
              />
            </div>
          </div>
        </div>

        <!-- Store Page -->
        <div v-else-if="isStorePage && stores.length > 0">
          <!-- Store Header -->
          <div class="bg-white rounded-2xl shadow-xl mb-8">
            <div
              class="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl px-8 py-10 text-white"
            >
              <h2 class="text-3xl font-bold mb-2">Select Products</h2>
              <p class="text-green-100 text-lg">
                Choose from our available products
              </p>
            </div>
          </div>

          <!-- Products Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <div v-for="store in stores" :key="store.id">
              <div
                v-for="item in store.items"
                :key="item.id"
                class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
              >
                <!-- Product Image Carousel -->
                <div
                  class="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden"
                >
                  <div
                    v-if="item.images && item.images.length > 0"
                    class="relative h-full"
                  >
                    <img
                      :src="item.images[0]"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                    <!-- Image indicators -->
                    <div
                      v-if="item.images.length > 1"
                      class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1"
                    >
                      <span
                        v-for="(img, idx) in item.images.slice(0, 3)"
                        :key="idx"
                        class="w-2 h-2 bg-white rounded-full opacity-70"
                      ></span>
                      <span
                        v-if="item.images.length > 3"
                        class="text-white text-xs ml-1"
                        >+{{ item.images.length - 3 }}</span
                      >
                    </div>
                    <!-- Badge -->
                    <div
                      v-if="item.infinite"
                      class="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full"
                    >
                      In Stock
                    </div>
                    <div
                      v-else-if="item.quantity > 0"
                      class="absolute top-3 left-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full"
                    >
                      {{ item.quantity }} left
                    </div>
                    <div
                      v-else
                      class="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full"
                    >
                      Out of Stock
                    </div>
                  </div>
                  <div
                    v-else
                    class="w-full h-full flex flex-col items-center justify-center"
                  >
                    <Package class="w-16 h-16 text-gray-400 mb-2" />
                    <span class="text-gray-500 text-sm"
                      >No image available</span
                    >
                  </div>
                </div>

                <!-- Product Info -->
                <div class="p-6">
                  <h3 class="font-bold text-lg text-gray-900 mb-2">
                    {{ item.name }}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    {{ item.description || "No description available" }}
                  </p>

                  <!-- Price and Quantity Selector -->
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-2xl font-bold text-green-600">
                        ${{ item.price.toFixed(2) }}
                      </span>
                      <span class="text-xs text-gray-500 ml-1">/each</span>
                    </div>

                    <!-- Quantity Controls -->
                    <div
                      class="flex items-center gap-1 bg-gray-100 rounded-lg p-1"
                    >
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors"
                      >
                        <span class="text-lg font-semibold">−</span>
                      </button>
                      <input
                        type="number"
                        value="0"
                        min="0"
                        :max="item.infinite ? 999 : item.quantity"
                        class="w-12 text-center bg-transparent font-semibold text-gray-900 focus:outline-none"
                      />
                      <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition-colors"
                      >
                        <span class="text-lg font-semibold">+</span>
                      </button>
                    </div>
                  </div>

                  <!-- Add to Cart Button -->
                  <button
                    class="w-full mt-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart Summary (Optional) -->
          <div class="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div
                class="border-t pt-2 flex justify-between text-lg font-bold text-gray-900"
              >
                <span>Total</span>
                <span>$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Navigation -->
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <button
            @click="prevStep"
            :disabled="currentStep === 0"
            :class="[
              'flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors',
              currentStep === 0
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
            ]"
          >
            <ChevronLeft class="w-4 h-4" />
            Previous
          </button>

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">
              Step {{ currentStep + 1 }} of {{ totalSteps }}
            </span>
          </div>

          <button
            v-if="currentStep < totalSteps - 1"
            @click="nextStep"
            class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
          >
            Next
            <ChevronRight class="w-4 h-4" />
          </button>
          <button
            v-else
            @click="handleSubmit"
            class="px-6 py-2.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
          >
            Submit Form
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
