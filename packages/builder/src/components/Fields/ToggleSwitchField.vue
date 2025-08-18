<script setup lang="ts">
import type { FormField } from "@/types";
import { ref, watch, nextTick } from "vue";
import { Grip, ToggleLeft, Edit3 } from "lucide-vue-next";

interface Props {
  field: FormField;
  isSelected?: boolean;
  isDisabled?: boolean;
  mode?: 'builder' | 'preview' | 'fill';
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDisabled: false,
  mode: 'builder',
  modelValue: false,
});

const emit = defineEmits<{
  "update:field": [field: FormField];
  "update:modelValue": [value: boolean];
  delete: [];
}>();

const isEditingLabel = ref(false);
const labelInput = ref<HTMLInputElement>();
const localLabel = ref(props.field.label);
const toggleValue = ref(true);
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

const handleToggleChange = () => {
  localValue.value = !localValue.value;
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
          class="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center"
        >
          <ToggleLeft class="w-4 h-4 text-teal-600" />
        </div>
      </div>

      <!-- Field Type Badge -->
      <div
        class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
      >
        Toggle Switch
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

      <!-- Preview Toggle -->
      <div class="relative">
        <div
          class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
        >
          <div>
            <p class="text-sm text-slate-700">
              {{ field.toggleLabel || "Enable this option" }}
            </p>
            <p
              v-if="field.toggleDescription"
              class="text-xs text-slate-500 mt-1"
            >
              {{ field.toggleDescription }}
            </p>
          </div>

          <!-- Toggle Switch -->
          <button
            @click="toggleValue = !toggleValue"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-not-allowed"
            :class="toggleValue ? 'bg-teal-500' : 'bg-slate-300'"
            disabled
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="toggleValue ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
        <div
          class="absolute inset-0 rounded-lg bg-slate-50/50 pointer-events-none"
        ></div>
      </div>

      <!-- Toggle Configuration -->
      <div class="mt-2 flex items-center gap-2">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
        >
          Default: {{ field.defaultValue ? "ON" : "OFF" }}
        </span>
        <span
          v-if="field.requiredOn"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700"
        >
          Must be ON
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
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <label class="text-sm font-medium text-gray-700">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
        </label>
        <p v-if="field.helperText" class="text-xs text-gray-500 mt-1">
          {{ field.helperText }}
        </p>
      </div>
      <button
        class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 cursor-not-allowed"
        disabled
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"
        />
      </button>
    </div>
  </div>

  <!-- Fill Mode -->
  <div v-else class="mb-4">
    <div class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div>
        <label :for="`field-${field.id}`" class="text-sm font-medium text-gray-700 cursor-pointer">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500 ml-0.5">*</span>
        </label>
        <p v-if="field.helperText" class="text-xs text-gray-500 mt-1">
          {{ field.helperText }}
        </p>
      </div>
      <button
        :id="`field-${field.id}`"
        @click="handleToggleChange"
        type="button"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-green-200"
        :class="localValue ? 'bg-green-500' : 'bg-gray-300'"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          :class="localValue ? 'translate-x-6' : 'translate-x-1'"
        />
      </button>
    </div>
  </div>
</template>
