<template>
  <div class="min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <button
          @click="$emit('close')"
          class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Builder
        </button>

        <button
          class="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Publish
        </button>
      </div>

      <!-- Form Container -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Form Header -->
        <div class="text-center py-8 px-6 border-b border-gray-200">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            {{ form.title || "Form Preview" }}
          </h1>
          <p class="text-gray-600">
            {{ form.description || "Preview of your form" }}
          </p>
        </div>

        <!-- Progress Steps -->
        <div class="px-6 py-6 border-b border-gray-200">
          <div class="flex items-center justify-center">
            <div class="flex items-center space-x-8">
              <div
                v-for="(step, index) in steps"
                :key="index"
                class="flex flex-col items-center"
              >
                <div class="flex items-center">
                  <!-- Step Circle -->
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
                      currentStep > index
                        ? 'bg-green-500 text-white'
                        : currentStep === index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600',
                    ]"
                  >
                    {{ index + 1 }}
                  </div>

                  <!-- Progress Line -->
                  <div
                    v-if="index < steps.length - 1"
                    :class="[
                      'h-1 w-20 ml-4',
                      currentStep > index ? 'bg-green-500' : 'bg-gray-200',
                    ]"
                  ></div>
                </div>

                <!-- Step Info -->
                <div class="mt-3 text-center">
                  <div class="text-sm font-medium text-gray-900">
                    {{ step.title }}
                  </div>
                  <div class="text-xs text-gray-500">{{ step.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <!-- Form Step Content -->
          <div v-if="currentStepData.type === 'form'" class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-6">
                {{ currentStepData.title }}
              </h3>
              <p v-if="currentStepData.description" class="text-gray-600 mb-6">
                {{ currentStepData.description }}
              </p>

              <div
                v-if="currentStepData.fields.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div v-for="field in currentStepData.fields" :key="field.id">
                  <component
                    :is="getPreviewFieldComponent(field.type)"
                    :field="field"
                    :preview="true"
                  />
                </div>
              </div>
              <div v-else class="text-center py-8">
                <p class="text-gray-500">No fields added to this page yet.</p>
              </div>
            </div>
          </div>

          <!-- Store Step Content -->
          <div v-else-if="currentStepData.type === 'store'" class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-6">
                {{ currentStepData.title }}
              </h3>

              <div v-if="currentStepData.stores.length > 0" class="space-y-6">
                <div
                  v-for="store in currentStepData.stores"
                  :key="store.id"
                  class="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <h4 class="text-md font-semibold text-gray-800 mb-4">
                    {{ store.name }}
                  </h4>

                  <div
                    v-if="store.items.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <div
                      v-for="item in store.items"
                      :key="item.id"
                      class="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <!-- Product Image Placeholder -->
                      <div
                        class="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center"
                      >
                        <svg
                          class="w-6 h-6 text-gray-400"
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
                      <h5 class="font-medium text-gray-900 text-sm mb-1">
                        {{ item.name }}
                      </h5>
                      <p class="text-xs text-gray-600 mb-2 line-clamp-2">
                        {{ item.description || "No description" }}
                      </p>

                      <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold text-teal-600"
                          >Ksh{{ item.price }}</span
                        >
                        <span
                          class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded"
                          >Qty: {{ item.quantity }}</span
                        >
                      </div>

                      <!-- Selection checkbox -->
                      <div class="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          class="mr-2"
                          :id="`product-${item.id}`"
                        />
                        <label
                          :for="`product-${item.id}`"
                          class="text-xs text-gray-600"
                          >Select this product</label
                        >
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center py-8">
                    <p class="text-gray-500">No products in this store yet.</p>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <p class="text-gray-500">No stores configured yet.</p>
              </div>
            </div>
          </div>

          <!-- Review Step Content -->
          <div v-else-if="currentStepData.type === 'review'" class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-6">
                {{ currentStepData.title }}
              </h3>

              <div class="space-y-6">
                <!-- Form Data Summary -->
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 class="font-medium text-gray-800 mb-3">
                    Form Information
                  </h4>
                  <div class="space-y-2">
                    <div v-for="page in form.pages" :key="page.id">
                      <p class="text-sm">
                        <strong>{{ page.title || `Page ${page.id}` }}:</strong>
                        {{ page.fields.length }} fields
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Store Selection Summary -->
                <div
                  v-if="stores && stores.length > 0"
                  class="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <h4 class="font-medium text-gray-800 mb-3">
                    Selected Products
                  </h4>
                  <p class="text-sm text-gray-600">
                    Product selection summary would appear here
                  </p>
                </div>

                <!-- Submit Button -->
                <div class="text-center pt-6">
                  <button
                    class="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    {{ form.settings.submitText || "Submit Form" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div
          class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between"
        >
          <button
            @click="previousStep"
            :disabled="currentStep === 0"
            :class="[
              'flex items-center gap-2 px-6 py-2 border rounded-md transition-colors',
              currentStep === 0
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100',
            ]"
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

          <button
            @click="nextStep"
            :disabled="currentStep === steps.length - 1"
            :class="[
              'flex items-center gap-2 px-6 py-2 rounded-md transition-colors',
              currentStep === steps.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-900',
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
        </div>
      </div>
    </div>
    <FormRenderer :form="form" :stores="stores" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { FormSchema, Store } from "@/types";
import FormRenderer from "./FormRenderer.vue";

// Props
const props = defineProps<{
  form: FormSchema;
  stores?: Store[];
}>();

// Emits
defineEmits<{
  close: [];
}>();

// Data
const currentStep = ref(0);

// Generate steps dynamically from form pages and stores
const steps = computed(() => {
  const formSteps = props.form.pages.map((page, index) => ({
    title: page.title || `Page ${index + 1}`,
    subtitle: `Form fields (${page.fields.length} fields)`,
    type: "form",
    pageId: page.id,
  }));

  const storeSteps =
    props.stores && props.stores.length > 0
      ? [
          {
            title: "Marketplace",
            subtitle: `Select products (${props.stores.reduce((total, store) => total + store.items.length, 0)} products)`,
            type: "store",
          },
        ]
      : [];

  const reviewStep = [
    {
      title: "Review & Submit",
      subtitle: "Confirm and submit",
      type: "review",
    },
  ];

  return [...formSteps, ...storeSteps, ...reviewStep];
});

// Computed
const currentStepData = computed(() => {
  const step = steps.value[currentStep.value];
  if (!step) return { fields: [], stores: [], type: "form" };

  if (step.type === "form") {
    const page = props.form.pages.find((p) => p.id === step.pageId);
    return {
      fields: page?.fields || [],
      stores: [],
      type: "form",
      title: page?.title || step.title,
      description: page?.description || "",
    };
  } else if (step.type === "store") {
    return {
      fields: [],
      stores: props.stores || [],
      type: "store",
      title: step.title,
      description: step.subtitle,
    };
  } else {
    return {
      fields: [],
      stores: [],
      type: "review",
      title: step.title,
      description: step.subtitle,
    };
  }
});

// Methods
function nextStep() {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function getPreviewFieldComponent(type: string) {
  const components = {
    text: "PreviewTextInput",
    email: "PreviewTextInput",
    phone: "PreviewTextInput",
    name: "PreviewNameField",
    longtext: "PreviewTextArea",
    date: "PreviewDatePicker",
    rating: "PreviewRating",
    file: "PreviewFileUpload",
  };

  return components[type] || "PreviewTextInput";
}
</script>

<!-- Preview Field Components -->
<script lang="ts">
export default {
  components: {
    PreviewTextInput: {
      props: ["field", "preview"],
      template: `
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            :placeholder="field.placeholder"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      `,
    },

    PreviewNameField: {
      props: ["field", "preview"],
      template: `
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ field.label }}</label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">First Name*</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Last Name*</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
        </div>
      `,
    },

    PreviewTextArea: {
      props: ["field", "preview"],
      template: `
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ field.label }}</label>
          <textarea 
            rows="4"
            :placeholder="field.placeholder"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>
      `,
    },

    PreviewDatePicker: {
      props: ["field", "preview"],
      template: `
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ field.label }}</label>
          <div class="relative">
            <input 
              type="text" 
              placeholder="MM/DD/YY"
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg class="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
      `,
    },

    PreviewRating: {
      props: ["field", "preview"],
      template: `
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ field.label }}</label>
          <div class="flex gap-2">
            <svg v-for="i in 5" :key="i" class="w-8 h-8 text-gray-300 hover:text-yellow-400 cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      `,
    },

    PreviewFileUpload: {
      props: ["field", "preview"],
      data() {
        return {
          isDragOver: false,
          uploadedFiles: [],
        };
      },
      template: `
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
          
          <!-- Drop Zone -->
          <div 
            @dragover.prevent="handleDragOver"
            @dragenter.prevent="handleDragEnter"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            ]"
            @click="triggerFileInput"
          >
            <input 
              ref="fileInput"
              type="file" 
              multiple 
              class="hidden" 
              @change="handleFileSelect"
            />
            
            <div v-if="uploadedFiles.length === 0">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p class="text-gray-600 mb-2">
                <span class="font-medium text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p class="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
            
            <!-- Uploaded Files Display -->
            <div v-else class="space-y-2">
              <div 
                v-for="(file, index) in uploadedFiles" 
                :key="index"
                class="flex items-center justify-between bg-white p-3 rounded-md border"
              >
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button 
                  @click.stop="removeFile(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <!-- Add More Files Button -->
              <button 
                @click.stop="triggerFileInput"
                class="w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Add more files
              </button>
            </div>
          </div>
        </div>
      `,
      methods: {
        handleDragOver(event) {
          event.preventDefault();
          this.isDragOver = true;
        },
        handleDragEnter(event) {
          event.preventDefault();
          this.isDragOver = true;
        },
        handleDragLeave(event) {
          event.preventDefault();
          // Only set to false if we're leaving the drop zone completely
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX;
          const y = event.clientY;

          if (
            x < rect.left ||
            x > rect.right ||
            y < rect.top ||
            y > rect.bottom
          ) {
            this.isDragOver = false;
          }
        },
        handleDrop(event) {
          event.preventDefault();
          this.isDragOver = false;
          const files = Array.from(event.dataTransfer.files);
          this.addFiles(files);
        },
        triggerFileInput() {
          this.$refs.fileInput.click();
        },
        handleFileSelect(event) {
          const files = Array.from(event.target.files);
          this.addFiles(files);
        },
        addFiles(files) {
          // Filter for allowed file types and size
          const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "application/pdf",
          ];
          const maxSize = 10 * 1024 * 1024; // 10MB

          const validFiles = files.filter((file) => {
            if (!allowedTypes.includes(file.type)) {
              alert(
                `File ${file.name} is not a supported format. Please use PNG, JPG, or PDF.`,
              );
              return false;
            }
            if (file.size > maxSize) {
              alert(`File ${file.name} is too large. Maximum size is 10MB.`);
              return false;
            }
            return true;
          });

          this.uploadedFiles = [...this.uploadedFiles, ...validFiles];
        },
        removeFile(index) {
          this.uploadedFiles.splice(index, 1);
        },
        formatFileSize(bytes) {
          if (bytes === 0) return "0 Bytes";
          const k = 1024;
          const sizes = ["Bytes", "KB", "MB", "GB"];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
          );
        },
      },
    },
  },
};
</script>
