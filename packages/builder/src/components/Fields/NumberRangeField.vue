<script setup lang="ts">
import type { FormField } from "@/types";
import { ref, watch, nextTick } from "vue";
import { Grip, SlidersHorizontal, Edit3 } from "lucide-vue-next";

interface Props {
  field: FormField;
  isSelected?: boolean;
  isDisabled?: boolean;
  mode?: 'builder' | 'preview' | 'fill';
  modelValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDisabled: false,
  mode: 'builder',
  modelValue: 50,
});

const emit = defineEmits<{
  "update:field": [field: FormField];
  "update:modelValue": [value: number];
  delete: [];
}>();

const isEditingLabel = ref(false);
const labelInput = ref<HTMLInputElement>();
const localLabel = ref(props.field.label);
const rangeValue = ref(50);
const localValue = ref(props.modelValue);

const startEditingLabel = async () => {
  isEditingLabel.value = true;
  localLabel.value = props.field.label;
  await nextTick();
  labelInput.value?.focus();
  labelInput.value?.select();
};

const finishEditingLabel = () => {
  isEditingLabel.value = false;
  if (localLabel.value.trim()) {
    emit("update:field", { ...props.field, label: localLabel.value.trim() });
  } else {
    localLabel.value = props.field.label;
  }
};

const cancelEditingLabel = () => {
  isEditingLabel.value = false;
  localLabel.value = props.field.label;
};

const handleRangeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localValue.value = Number(target.value);
  emit('update:modelValue', localValue.value);
};

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});
</script>

<template>
  <!-- Builder Mode -->
  <div
    v-if="mode === 'builder'"
    class="relative group bg-white rounded-xl border-2 transition-all duration-200"
    :class="[
      isSelected
        ? 'border-indigo-500 shadow-lg shadow-indigo-100'
        : 'border-slate-200 hover:border-slate-300 hover:shadow-md',
    ]"
  >
    <!-- Field Header -->
    <div class="flex items-center justify-between px-4 pt-4 pb-2">
      <!-- Drag Handle -->
      <div class="flex items-center gap-2">
        <div
          class="cursor-move opacity-0 group-hover:opacity-100 transition-opacity drag-handle"
        >
          <Grip class="w-4 h-4 text-slate-400 hover:text-slate-600" />
        </div>

        <!-- Field Type Icon -->
        <div
          class="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center"
        >
          <SlidersHorizontal class="w-4 h-4 text-amber-600" />
        </div>
      </div>

      <!-- Field Type Badge -->
      <div
        class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
      >
        Number Range
      </div>
    </div>

    <!-- Field Content -->
    <div class="px-4 pb-4">
      <!-- Editable Label -->
      <div class="mb-3">
        <div
          v-if="!isEditingLabel"
          @click="startEditingLabel"
          class="flex items-center gap-2 group/label cursor-text hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
        >
          <label class="text-sm font-semibold text-slate-700">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
          </label>
          <Edit3
            class="w-3 h-3 text-slate-400 opacity-0 group-hover/label:opacity-100 transition-opacity"
          />
        </div>

        <input
          v-else
          ref="labelInput"
          v-model="localLabel"
          @blur="finishEditingLabel"
          @keyup.enter="finishEditingLabel"
          @keyup.escape="cancelEditingLabel"
          class="w-full px-2 py-1 text-sm font-semibold text-slate-700 bg-white border-2 border-indigo-200 rounded-lg outline-none focus:ring-indigo-200"
          placeholder="Field label"
        />
      </div>

      <!-- Preview Range Slider -->
      <div class="relative">
        <div class="space-y-3">
          <!-- Range Slider -->
          <div class="relative">
            <input
              type="range"
              :min="field.min || 0"
              :max="field.max || 100"
              :step="field.step || 1"
              v-model="rangeValue"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-not-allowed"
              disabled
            />
            <!-- Value Display -->
            <div
              class="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs px-2 py-1 rounded"
            >
              {{ rangeValue }}
            </div>
          </div>

          <!-- Min/Max Labels -->
          <div class="flex justify-between text-xs text-slate-500">
            <span>{{ field.min || 0 }}</span>
            <span>{{ field.max || 100 }}</span>
          </div>
        </div>
        <div
          class="absolute inset-0 rounded-lg bg-slate-50/50 pointer-events-none"
        ></div>
      </div>

      <!-- Range Configuration -->
      <div class="mt-2 flex flex-wrap gap-1">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
        >
          Min: {{ field.min || 0 }}
        </span>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
        >
          Max: {{ field.max || 100 }}
        </span>
        <span
          v-if="field.step && field.step !== 1"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"
        >
          Step: {{ field.step }}
        </span>
      </div>

      <!-- Helper Text -->
      <div v-if="field.helperText" class="mt-2 text-xs text-slate-500">
        {{ field.helperText }}
      </div>
    </div>

    <!-- Selection Indicator -->
    <div
      v-if="isSelected"
      class="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"
    ></div>
  </div>

  <!-- Preview Mode -->
  <div v-else-if="mode === 'preview'" class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="space-y-3">
      <input
        type="range"
        :min="field.min || 0"
        :max="field.max || 100"
        :step="field.step || 1"
        :value="(field.min || 0) + ((field.max || 100) - (field.min || 0)) / 2"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-not-allowed"
        disabled
      />
      <div class="flex justify-between text-xs text-gray-500">
        <span>{{ field.min || 0 }}</span>
        <span>{{ field.max || 100 }}</span>
      </div>
    </div>
    <div v-if="field.helperText" class="mt-1 text-xs text-gray-500">
      {{ field.helperText }}
    </div>
  </div>

  <!-- Fill Mode -->
  <div v-else class="mb-4">
    <label :for="`field-${field.id}`" class="block text-sm font-medium text-gray-700 mb-2">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="space-y-3">
      <div class="relative">
        <input
          :id="`field-${field.id}`"
          type="range"
          :min="field.min || 0"
          :max="field.max || 100"
          :step="field.step || 1"
          :value="localValue"
          @input="handleRangeChange"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-200"
          :style="{
            background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${((localValue - (field.min || 0)) / ((field.max || 100) - (field.min || 0))) * 100}%, rgb(229 231 235) ${((localValue - (field.min || 0)) / ((field.max || 100) - (field.min || 0))) * 100}%, rgb(229 231 235) 100%)`
          }"
        />
        <div class="absolute -top-8 px-2 py-1 bg-green-500 text-white text-xs rounded"
             :style="{left: `${((localValue - (field.min || 0)) / ((field.max || 100) - (field.min || 0))) * 100}%`, transform: 'translateX(-50%)'}"
        >
          {{ localValue }}
        </div>
      </div>
      <div class="flex justify-between text-xs text-gray-500">
        <span>{{ field.min || 0 }}</span>
        <span class="font-semibold text-gray-700">Current: {{ localValue }}</span>
        <span>{{ field.max || 100 }}</span>
      </div>
    </div>
    <div v-if="field.helperText" class="mt-1 text-xs text-gray-500">
      {{ field.helperText }}
    </div>
  </div>
</template>
