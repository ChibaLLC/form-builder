<script setup lang="ts">
import type { FormField } from "@/types";

const props = defineProps<{
  selectedField: FormField;
  fields: FormField[];
}>();
const emits = defineEmits(["close"]);
const fieldHasPlaceholder = (fieldType: string) => {
  return ["text", "email", "phone", "longtext"].includes(fieldType);
};
const addOption = () => {
  if (!props.selectedField.options) {
    props.selectedField.options = [];
  }
  const newOptionNumber = props.selectedField.options.length + 1;
  props.selectedField.options.push({
    label: `Option ${newOptionNumber}`,
    value: `Option ${newOptionNumber}`,
  });
};
const removeOption = (index: number) => {
  if (props.selectedField.options && props.selectedField.options.length > 1) {
    props.selectedField.options.splice(index, 1);
  }
};
</script>
<template>
  <aside
    v-if="selectedField"
    class="w-96 bg-white border-l border-gray-200 overflow-y-auto"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Element Properties</h3>
        <button
          class="text-gray-400 hover:text-gray-600"
          @click="emits('close')"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Field Properties Form -->
      <div class="space-y-6">
        <!-- Label -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Label</label
          >
          <input
            v-model="selectedField.label"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Placeholder (if applicable) -->
        <div v-if="fieldHasPlaceholder(selectedField.type)">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Placeholder</label
          >
          <input
            v-model="selectedField.placeholder"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Number of fields (for grouped fields) -->
        <div v-if="selectedField.type === 'name'">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Number of fields</label
          >
          <div class="flex gap-2">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Max</label>
              <input
                v-model.number="selectedField.maxFields"
                type="number"
                class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Min</label>
              <input
                v-model.number="selectedField.minFields"
                type="number"
                class="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Options Management (for select fields) -->
        <div v-if="selectedField.type === 'select'">
          <label class="block text-sm font-medium text-gray-700 mb-3"
            >Options</label
          >
          <div class="space-y-2 mb-3">
            <div
              v-for="(option, index) in selectedField.options || []"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                v-model="option.label"
                type="text"
                placeholder="Option label"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                v-model="option.value"
                type="text"
                placeholder="Value"
                class="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                @click="removeOption(index)"
                class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                title="Remove option"
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
          </div>
          <button
            @click="addOption"
            class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
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
            Add Option
          </button>
        </div>

        <!-- Required -->
        <div>
          <label class="flex items-center gap-2">
            <input
              v-model="selectedField.required"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700">Required</span>
          </label>
        </div>

        <!-- Rules Section -->
        <div class="pt-6 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-900 mb-4">Rules</h4>

          <div>
            <label class="block text-sm text-gray-700 mb-2">Depends on</label>
            <select
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select field...</option>
              <option
                v-for="field in fields.filter((f) => f.id !== selectedField.id)"
                :key="field.id"
                :value="field.id"
              >
                {{ field.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Help Text -->
        <div class="pt-6 border-t border-gray-200">
          <div class="flex items-start gap-2 text-xs text-gray-500">
            <svg
              class="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Click the 'Esc' key to exit properties</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
