<script setup lang="ts">
import type { FormField } from "@/types";
import { ref } from "vue";

const props = defineProps<{
  field: FormField;
  isSelected: boolean;
}>();
const isEditingLabel = ref(false);
const exitFromEditing = () => {
  isEditingLabel.value = false;
};
const removeOptionInline = (index: number) => {
  if (props.field.options && props.field.options.length > 1) {
    props.field.options.splice(index, 1);
  } else {
    alert("A select field must have more than 1 option");
  }
};
const addOptionInline = () => {
  if (!props.field.options) {
    props.field.options = [];
  }
  const newOptionNumber = props.field.options.length + 1;
  props.field.options.push({
    label: `Option ${newOptionNumber}`,
    value: `option ${newOptionNumber}`,
  });
};
const addMultipleOptions = () => {
  for (let index = 0; index < 3; index++) {
    addOptionInline();
  }
};
const clearAllOptions = () => {
  if (confirm("Are you sure you want to delete all options!")) {
    props.field.options = [{ label: "Option 1", value: "option 1" }];
  }
};
</script>
<template>
  <div
    class="p-4 border border-gray-200 rounded-lg bg-white relative group"
    :class="{ 'ring-2 ring-blue-500': isSelected }"
  >
    <!-- Drag Handle -->
    <div
      class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move drag-handle"
    >
      <svg
        class="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </div>

    <!-- Editable Label -->
    <label
      class="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
      @click="isEditingLabel = true"
    >
      <input
        v-if="isEditingLabel"
        v-model="field.label"
        @blur="exitFromEditing()"
        @keyup.enter="exitFromEditing()"
        @keyup.escape="exitFromEditing()"
        class="bg-transparent border-b border-blue-500 outline-none"
        ref="labelInput"
      />
      <span v-else>
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </span>
    </label>

    <select
      class="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      disabled
    >
      <option value="">Choose an option</option>
      <option
        v-for="option in field.options || []"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Always Visible Options Management Section -->
    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
          <span class="text-sm font-medium text-blue-900"
            >Options Management</span
          >
        </div>
        <span class="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full"
          >{{ (field.options || []).length }} option{{
            (field.options || []).length !== 1 ? "s" : ""
          }}</span
        >
      </div>

      <!-- Options List -->
      <div class="space-y-2 mb-3">
        <div
          v-for="(option, index) in field.options || []"
          :key="index"
          class="flex items-center gap-2 bg-white rounded-md p-2 border border-blue-200"
        >
          <div class="flex-1 grid grid-cols-2 gap-2">
            <input
              v-model="option.label"
              type="text"
              placeholder="Option label"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              v-model="option.value"
              type="text"
              placeholder="Value"
              class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            @click="removeOptionInline(index)"
            class="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <!-- Empty state for no options -->
        <div
          v-if="!field.options || field.options.length === 0"
          class="text-center py-4 text-gray-500 bg-white rounded-md border border-dashed border-gray-300"
        >
          <svg
            class="w-8 h-8 mx-auto mb-2 text-gray-400"
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
          <p class="text-sm">No options yet</p>
        </div>
      </div>

      <!-- Add Option Button -->
      <button
        @click="addOptionInline"
        class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
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
        Add New Option
      </button>

      <!-- Quick Actions -->
      <div class="flex gap-2 mt-3">
        <button
          @click="addMultipleOptions"
          class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors text-xs"
        >
          <svg
            class="w-3 h-3"
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
          Add 3 Options
        </button>
        <button
          @click="clearAllOptions"
          v-if="field.options && field.options.length > 0"
          class="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-xs"
        >
          <svg
            class="w-3 h-3"
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
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>
