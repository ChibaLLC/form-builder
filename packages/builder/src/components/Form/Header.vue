<script setup lang="ts">
import type { FormSchema } from "@/types";
import { ref } from "vue";

const props = defineProps<{
  form: FormSchema;
}>();
const emits = defineEmits(["togglePreview"]);
const fileInput = ref<HTMLInputElement>();

const triggerImport = () => {
  fileInput.value?.click();
};
const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target?.result as string);

      // Validate the imported data structure
      if (!importedData.formName || !Array.isArray(importedData.pages)) {
        throw new Error("Invalid file format");
      }

      // Confirm import
      if (
        confirm(
          "This will replace all current form data. Are you sure you want to import?",
        )
      ) {
        // Import the data
        formName.value = importedData.formName || "Imported Form";

        // Ensure all imported fields have columnSpan property
        const normalizedPages = importedData.pages.map((page) => ({
          ...page,
          fields: page.fields.map((field) => ({
            ...field,
            columnSpan: field.columnSpan || 1, // Default to 1 if not present
          })),
        }));

        pages.value = normalizedPages;
        currentPage.value = importedData.currentPage || 1;
        totalPages.value = importedData.totalPages || 1;

        // Import grid layout settings if available
        if (importedData.currentColumns) {
          currentColumns.value = importedData.currentColumns;
        }
        if (importedData.columnGap) {
          columnGap.value = importedData.columnGap;
        }
        if (importedData.responsiveColumns !== undefined) {
          responsiveColumns.value = importedData.responsiveColumns;
        }

        // Switch to the current page
        const targetPage = pages.value.find((p) => p.id === currentPage.value);
        if (targetPage) {
          pageTitle.value = targetPage.title;
          // Ensure current form fields also have columnSpan
          formFields.value = targetPage.fields.map((field) => ({
            ...field,
            columnSpan: field.columnSpan || 1,
          }));
        } else {
          // Fallback to first page if current page doesn't exist
          const firstPage = pages.value[0];
          if (firstPage) {
            currentPage.value = firstPage.id;
            pageTitle.value = firstPage.title;
            formFields.value = firstPage.fields.map((field) => ({
              ...field,
              columnSpan: field.columnSpan || 1,
            }));
          }
        }

        selectedFieldId.value = null;

        alert("Form data imported successfully!");
      }
    } catch (error) {
      alert("Error importing file: Invalid JSON format or corrupted data.");
    }
  };

  reader.readAsText(file);

  // Reset the file input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const exportData = () => {
  // Save current page data before export
  saveCurrentPageData();

  // Ensure all fields have columnSpan property explicitly set
  const normalizedFields = formFields.value.map((field) => ({
    ...field,
    columnSpan: field.columnSpan || 1, // Default to 1 if not set
  }));

  // Normalize pages data to include columnSpan for all fields
  const normalizedPages = pages.value.map((page) => ({
    ...page,
    fields: page.fields.map((field) => ({
      ...field,
      columnSpan: field.columnSpan || 1,
    })),
  }));

  const exportData = {
    formName: formName.value,
    formFields: normalizedFields,
    pages: normalizedPages,
    pageTitle: pageTitle.value,
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    currentColumns: currentColumns.value,
    columnGap: columnGap.value,
    responsiveColumns: responsiveColumns.value,
    exportTimestamp: new Date().toISOString(),
    version: "2.0", // Updated version for grid-based system
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${formName.value.replace(/\s+/g, "_").toLowerCase()}_export_${new Date().toISOString().split("T")[0]}.json`;
  link.click();

  URL.revokeObjectURL(link.href);

  // Show success message
  alert("Form data exported successfully!");
};
</script>
<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
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
          Back to Dashboard
        </button>
        <h1 class="text-xl font-semibold text-gray-900">{{ form.title }}</h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="exportData"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export
        </button>
        <button
          @click="triggerImport()"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          Import
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Save Draft
        </button>
        <button
          @click="$emit('togglePreview')"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Preview
        </button>
        <button
          class="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Publish
        </button>
      </div>
    </div>
  </header>
</template>
