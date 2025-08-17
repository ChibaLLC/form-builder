<script setup lang="ts">
import { ref, computed } from "vue";
import FormPreview from "./FormPreview.vue";

import Header from "./Form/Header.vue";
import type { FormField, FormSchema, Store as StoreType } from "@/types";
import Elements from "./Form/Elements.vue";
import Renderer from "./Form/Builder/Renderer.vue";
import Settings from "./Settings/Settings.vue";
import Store from "./Store/Store.vue";

// Data
const form = ref<FormSchema>({
  id: 1,
  title: "My Form",
  description: "Build your form here",
  pages: [
    {
      id: 1,
      title: "Page 1",
      description: "First page of the form",
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

const tabs = [
  { key: "builder", label: "Form Builder" },
  { key: "store", label: "Store & Products" },
  { key: "settings", label: "Settings" },
];

const showPreview = ref(false);

function togglePreview() {
  showPreview.value = !showPreview.value;
}

function updateStores(newStores: StoreType[]) {
  stores.value = newStores;
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <Header :form="form" @toggle-preview="togglePreview" />

    <!-- Tab Navigation -->
    <nav class="bg-white border-b border-gray-200 px-6">
      <div class="flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="h-[calc(100vh-140px)]">
      <!-- Form Builder Tab -->
      <div v-if="activeTab === 'builder'" class="flex h-full">
        <!-- Form Elements Sidebar -->
        <Elements />

        <!-- Form Canvas -->
        <Renderer :form="form" />
      </div>

      <!-- Store & Products Tab -->
      <div v-else-if="activeTab === 'store'" class="h-full">
        <Store @update-stores="updateStores" />
      </div>

      <!-- Settings Tab -->
      <div v-else-if="activeTab === 'settings'" class="h-full">
        <Settings />
      </div>
    </div>

    <!-- Preview Modal -->
    <FormPreview
      v-if="showPreview"
      :form="form"
      :stores="stores"
      @close="togglePreview"
    />

    <!-- Hidden file input for import -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      @change="handleFileImport"
      style="display: none"
    />
  </div>
</template>

<style scoped>
/* Theme system CSS variables */
.form-builder-interface {
  background: var(--fb-color-background, #ffffff);
  color: var(--fb-color-text, #1e293b);
  font-family: var(--fb-typography-fontFamily, "Inter, system-ui, sans-serif");
  font-size: var(--fb-typography-fontSize, 14px);
  min-height: 100vh;
}

.theme-selector {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--fb-color-surface, #f8fafc);
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--fb-color-border, #e2e8f0);
  box-shadow: 0 2px 4px var(--fb-color-shadow, rgba(0, 0, 0, 0.1));
}

.theme-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--fb-color-textSecondary, #64748b);
}

.theme-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--fb-color-border, #e2e8f0);
  border-radius: 4px;
  background: var(--fb-color-background, #ffffff);
  color: var(--fb-color-text, #1e293b);
  font-size: 0.875rem;
  cursor: pointer;
}

.theme-select:focus {
  outline: none;
  border-color: var(--fb-color-borderFocus, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Add any custom styles here */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Grid column span classes */
.col-span-1 {
  grid-column: span 1 / span 1;
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
.col-span-3 {
  grid-column: span 3 / span 3;
}
.col-span-4 {
  grid-column: span 4 / span 4;
}
.col-span-5 {
  grid-column: span 5 / span 5;
}
.col-span-6 {
  grid-column: span 6 / span 6;
}
.col-span-7 {
  grid-column: span 7 / span 7;
}
.col-span-8 {
  grid-column: span 8 / span 8;
}
.col-span-9 {
  grid-column: span 9 / span 9;
}
.col-span-10 {
  grid-column: span 10 / span 10;
}
.col-span-11 {
  grid-column: span 11 / span 11;
}
.col-span-12 {
  grid-column: span 12 / span 12;
}

/* Grid template columns classes */
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.grid-cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
.grid-cols-6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

/* Gap classes */
.gap-1 {
  gap: 0.25rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-8 {
  gap: 2rem;
}

/* Responsive grid behavior */
@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr !important;
  }

  .responsive-grid > div {
    grid-column: span 1 !important;
  }
}

/* Column settings dropdown positioning */
.column-settings-dropdown {
  z-index: 50;
}

/* Click outside to close functionality */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.column-settings-dropdown {
  animation: fadeIn 0.15s ease-out;
}

/* Drag and drop visual feedback */
.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Field hover states */
.field-wrapper:hover .delete-button {
  opacity: 1;
}

.delete-button {
  opacity: 0;
  transition: opacity 0.2s;
}

/* Selected field highlight */
.field-selected {
  box-shadow: 0 0 0 2px #3b82f6;
  border-radius: 0.5rem;
}

/* Grid layout container */
.grid-container {
  display: grid;
  width: 100%;
  min-height: 200px;
}

/* Empty state styling */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  background-color: rgba(249, 250, 251, 0.5);
}

.empty-state.drag-over {
  border-color: #60a5fa;
  background-color: rgba(239, 246, 255, 0.5);
}
</style>
