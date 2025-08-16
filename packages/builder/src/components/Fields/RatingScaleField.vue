<script setup lang="ts">
import type { FormField } from "@/types";

const props = defineProps<{
  field: FormField;
  isSelected: boolean;
}>();
</script>
<template>
  <div
    class="p-4 border border-gray-200 rounded-lg bg-white"
    :class="{ 'ring-2 ring-blue-500': isSelected }"
  >
    <label class="block text-sm font-medium text-gray-700 mb-3">{{
      field.label
    }}</label>
    <div class="flex gap-2">
      <svg
        v-for="i in 5"
        :key="i"
        class="w-8 h-8 text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </div>
  </div>
</template>
