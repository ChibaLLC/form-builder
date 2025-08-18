<script setup lang="ts">
import type { FormField } from "@/types";
import { ref, watch, nextTick } from "vue";
import { Grip, Star, Edit3 } from "lucide-vue-next";

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
  modelValue: 0,
});

const emit = defineEmits<{
  "update:field": [field: FormField];
  "update:modelValue": [value: number];
  delete: [];
}>();

const isEditingLabel = ref(false);
const labelInput = ref<HTMLInputElement>();
const localLabel = ref(props.field.label);
const previewRating = ref(3);
const localValue = ref(props.modelValue || 0);

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

const handleRatingClick = (rating: number) => {
  localValue.value = rating;
  emit('update:modelValue', rating);
};

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue || 0;
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
          class="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center"
        >
          <Star class="w-4 h-4 text-yellow-600" />
        </div>
      </div>

      <!-- Field Type Badge -->
      <div
        class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
      >
        Rating Scale
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

      <!-- Preview Rating Scale -->
      <div class="relative">
        <div class="flex gap-2">
          <button
            v-for="n in field.maxRating || 5"
            :key="n"
            @click="previewRating = n"
            class="p-1 transition-all cursor-not-allowed"
            disabled
          >
            <Star
              :class="[
                'w-6 h-6 transition-colors',
                n <= previewRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-slate-200 text-slate-300',
              ]"
            />
          </button>
        </div>
        <div
          class="absolute inset-0 rounded-lg bg-slate-50/50 pointer-events-none"
        ></div>
      </div>

      <!-- Rating Configuration -->
      <div class="mt-2 flex items-center gap-3">
        <div class="flex items-center gap-1">
          <span class="text-xs text-slate-500">Max:</span>
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"
          >
            {{ field.maxRating || 5 }} stars
          </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-xs text-slate-500">Type:</span>
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
          >
            {{ field.ratingType || "stars" }}
          </span>
        </div>
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
    <div class="flex gap-2">
      <button
        v-for="n in field.maxRating || field.max || 5"
        :key="n"
        class="p-1 cursor-not-allowed"
        disabled
      >
        <Star
          :class="[
            'w-6 h-6 transition-colors',
            n <= 3
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-300',
          ]"
        />
      </button>
    </div>
    <div v-if="field.helperText" class="mt-1 text-xs text-gray-500">
      {{ field.helperText }}
    </div>
  </div>

  <!-- Fill Mode -->
  <div v-else class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
    </label>
    <div class="flex gap-2">
      <button
        v-for="n in field.maxRating || field.max || 5"
        :key="n"
        @click="handleRatingClick(n)"
        class="p-1 transition-all hover:scale-110"
        type="button"
      >
        <Star
          :class="[
            'w-6 h-6 transition-colors cursor-pointer',
            n <= localValue
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-200',
          ]"
        />
      </button>
    </div>
    <div v-if="field.helperText" class="mt-1 text-xs text-gray-500">
      {{ field.helperText }}
    </div>
  </div>
</template>
