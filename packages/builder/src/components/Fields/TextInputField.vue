<script setup lang="ts">
import type { FormField } from "@/types";
import { ref } from "vue";

const props = defineProps<{
  field: FormField;
  isSelected: boolean;
}>();
const emits = defineEmits(["update-label"]);
const isEditingLabel = ref(false);
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
        @blur="isEditingLabel = false"
        @keyup.enter="isEditingLabel = false"
        @keyup.escape="isEditingLabel = false"
        class="bg-transparent border-b border-blue-500 outline-none"
        ref="labelInput"
      />
      <span v-else>
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </span>
    </label>

    <input
      type="text"
      :placeholder="field.placeholder"
      class="w-full px-3 py-2 border border-gray-300 rounded-md"
      disabled
    />
  </div>
</template>
