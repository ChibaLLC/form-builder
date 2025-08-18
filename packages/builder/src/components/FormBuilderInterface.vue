<script setup lang="ts">
import { ref } from "vue";
import FormPreviewFullscreen from "./FormPreviewFullscreen.vue";
import PublishedFormRenderer from "./PublishedFormRenderer.vue";
import type { FormField, FormSchema, Store as StoreType } from "@/types";
import Elements from "./Form/Elements.vue";
import Renderer from "./Form/Builder/Renderer.vue";
import Settings from "./Settings/Settings.vue";
import Store from "./Store/Store.vue";
import { Eye, Download, Upload, Plus, Send, ArrowLeft, CheckCircle } from "lucide-vue-next";
import Properties from "./Form/Element/Properties.vue";

// Data
const form = ref<FormSchema>({
  id: 1,
  title: "Contact Form",
  description: "Get in touch with us",
  pages: [
    {
      id: 1,
      title: "Basic Information",
      description: "Tell us about yourself",
      fields: [] as FormField[],
    },
  ],
  settings: {
    submitText: "Submit",
    resetText: "Reset",
    layout: "vertical",
    spacing: "normal",
    theme: "light",
  },
} as FormSchema);

const activeTab = ref("builder");
const stores = ref<StoreType[]>([]);
const showPreview = ref(false);
const selectedField = ref<FormField | null>(null);
const fileInput = ref<HTMLInputElement>();
const isPublished = ref(false);
const publishedFormData = ref<any>(null);
const showPublishSuccess = ref(false);

const tabs = [
  { id: "builder", label: "Form Builder", icon: "📝" },
  { id: "store", label: "Store & Products", icon: "🛍️" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function selectField(field: FormField) {
  console.log(field);
  selectedField.value = field;
}

function updateField(updates: Partial<FormField>) {
  if (selectedField.value) {
    Object.assign(selectedField.value, updates);
  }
}

function addPage() {
  const newId = Math.max(...form.value.pages.map((p) => p.id)) + 1;
  form.value.pages.push({
    id: newId,
    title: `Page ${newId}`,
    description: `Description for page ${newId}`,
    fields: [],
  });
}

function togglePreview() {
  showPreview.value = !showPreview.value;
}

function updateStores(newStores: StoreType[]) {
  stores.value = newStores;
}

function handleExport() {
  const dataStr = JSON.stringify(form.value, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportLink = document.createElement("a");
  exportLink.setAttribute("href", dataUri);
  exportLink.setAttribute("download", `form-${Date.now()}.json`);
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
}

function handleImport() {
  fileInput.value?.click();
}

function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        form.value = importedData;
      } catch (error) {
        console.error("Failed to import form:", error);
        alert("Failed to import form. Please check the file format.");
      }
    };
    reader.readAsText(file);
  }
}

function handlePublish() {
  // Validate form has at least one field
  const hasFields = form.value.pages.some(page => page.fields.length > 0);
  
  if (!hasFields) {
    alert("Please add at least one field to your form before publishing.");
    return;
  }
  
  // Save the form data (in a real app, this would be sent to a server)
  publishedFormData.value = JSON.parse(JSON.stringify(form.value));
  
  // Show publish success notification
  showPublishSuccess.value = true;
  
  // Auto-hide success message after 3 seconds
  setTimeout(() => {
    showPublishSuccess.value = false;
    // Switch to published view
    isPublished.value = true;
  }, 2000);
}

function handleFormSubmit(data: { formData: Record<string, any>; selectedProducts: any[] }) {
  console.log("Form submitted with data:", data);
  
  // Create a summary message
  let message = "Form submitted successfully!\n\n";
  
  // Add form fields summary
  const fieldCount = Object.keys(data.formData).length;
  if (fieldCount > 0) {
    message += `✅ ${fieldCount} form field(s) filled\n`;
  }
  
  // Add selected products summary
  if (data.selectedProducts.length > 0) {
    message += `\n🛍️ Selected Products:\n`;
    let totalAmount = 0;
    data.selectedProducts.forEach(product => {
      const subtotal = product.price * product.selectedQuantity;
      totalAmount += subtotal;
      message += `• ${product.name} (${product.selectedQuantity}x @ $${product.price}) = $${subtotal}\n`;
    });
    message += `\n💰 Total: $${totalAmount.toFixed(2)}`;
  } else {
    message += "\nNo products selected.";
  }
  
  message += "\n\nCheck the console for detailed data.";
  
  alert(message);
  
  // Log detailed data to console
  console.group("📋 Form Submission Details");
  console.log("Form ID:", publishedFormData.value.id);
  console.log("Form Title:", publishedFormData.value.title);
  console.log("Form Data:", data.formData);
  if (data.selectedProducts.length > 0) {
    console.log("Selected Products:", data.selectedProducts);
    console.table(data.selectedProducts.map(p => ({
      Store: p.storeName,
      Product: p.name,
      Price: `$${p.price}`,
      Quantity: p.selectedQuantity,
      Subtotal: `$${(p.price * p.selectedQuantity).toFixed(2)}`
    })));
  }
  console.groupEnd();
  
  // In a real application, you would send this data to your backend
  // Example:
  // await api.submitForm({
  //   formId: publishedFormData.value.id,
  //   data: data.formData,
  //   products: data.selectedProducts
  // });
}

function backToBuilder() {
  isPublished.value = false;
  publishedFormData.value = null;
}
</script>

<template>
  <!-- Published Form View -->
  <div v-if="isPublished" class="min-h-screen bg-gray-50">
    <!-- Header for Published View -->
    <header class="bg-white border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              @click="backToBuilder"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">Published Form</h1>
              <p class="text-sm text-gray-500">This is how your form will appear to users</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center gap-2">
              <CheckCircle class="w-4 h-4" />
              Published
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Published Form Renderer -->
    <PublishedFormRenderer
      v-if="publishedFormData"
      :form="publishedFormData"
      :stores="stores"
      :show-stores="true"
      :show-header="true"
      @submit="handleFormSubmit"
    />
  </div>
  
  <!-- Form Builder View -->
  <div v-else class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo & Title -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">FB</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Form Builder</h1>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <button
              @click="handleImport"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload class="w-4 h-4" />
              Import
            </button>
            <button
              @click="handleExport"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download class="w-4 h-4" />
              Export
            </button>
            <button
              @click="togglePreview"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye class="w-4 h-4" />
              Preview
            </button>
            <button
              @click="handlePublish"
              class="px-5 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Send class="w-4 h-4" />
              Publish Form
            </button>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="flex items-center gap-1 mt-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-2.5 text-sm font-medium rounded-t-lg transition-all',
              activeTab === tab.id
                ? 'bg-gray-50 text-gray-900 border-t-2 border-green-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <span class="mr-2">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="flex h-[calc(100vh-140px)]">
      <!-- Form Builder Tab -->
      <template v-if="activeTab === 'builder'">
        <!-- Left: Elements Panel -->
        <div
          class="w-72 bg-white border-r border-gray-200 overflow-hidden flex flex-col"
        >
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900">Form Elements</h3>
            <p class="text-xs text-gray-500 mt-1">Drag elements to add them</p>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <Elements />
          </div>
        </div>

        <!-- Center: Canvas -->
        <div class="flex-1 bg-gray-50 overflow-auto">
          <div class="p-6">
            <!-- Page Tabs -->
            <div class="bg-white rounded-lg shadow-sm mb-6">
              <div class="px-4 py-3 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <button
                      v-for="(page, index) in form.pages"
                      :key="page.id"
                      class="px-4 py-1.5 text-sm font-medium rounded-md"
                      :class="[
                        index === 0
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'text-gray-600 hover:bg-gray-50',
                      ]"
                    >
                      {{ page.title || `Page ${index + 1}` }}
                    </button>
                    <button
                      @click="addPage"
                      class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <Renderer :form="form" @select-field="selectField" />
              </div>
            </div>
          </div>
        </div>

        <div class="w-80 bg-white border-l border-gray-200 overflow-hidden">
          <Properties
            v-if="selectedField"
            :field="selectedField"
            @update="updateField"
          />
          <div v-else class="p-6 text-center">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <span class="text-2xl">✏️</span>
            </div>
            <h3 class="text-sm font-medium text-gray-900 mb-1">
              No element selected
            </h3>
            <p class="text-xs text-gray-500">
              Click on a form element to edit its properties
            </p>
          </div>
        </div>
      </template>

      <!-- Store & Products Tab -->
      <template v-else-if="activeTab === 'store'">
        <div class="flex-1 bg-white">
          <Store @update-stores="updateStores" />
        </div>
      </template>

      <!-- Settings Tab -->
      <template v-else-if="activeTab === 'settings'">
        <div class="flex-1 bg-white">
          <Settings :form="form" />
        </div>
      </template>
    </div>

    <!-- Full-screen Preview -->
    <FormPreviewFullscreen
      v-if="showPreview"
      :form="form"
      :stores="stores"
      @close="togglePreview"
    />

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      @change="handleFileImport"
      class="hidden"
    />
    
    <!-- Publish Success Notification -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div
        v-if="showPublishSuccess"
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div class="bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3">
          <CheckCircle class="w-6 h-6" />
          <div>
            <p class="font-semibold">Form Published Successfully!</p>
            <p class="text-sm text-green-100">Redirecting to published view...</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
