<script setup lang="ts">
import type { FormField } from "@/types";
import { ref, watch, nextTick } from "vue";
import { Grip, Circle, Edit3, CircleDot } from "lucide-vue-next";

interface Props {
  field: FormField;
  isSelected?: boolean;
  isDisabled?: boolean;
  mode?: 'builder' | 'preview' | 'fill';
  modelValue?: any;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDisabled: false,
  mode: 'builder',
  modelValue: '',
});

const emit = defineEmits<{
  "update:field": [field: FormField];
  "update:modelValue": [value: any];
  delete: [];
}>();

const isEditingLabel = ref(false);
const labelInput = ref<HTMLInputElement>();
const localLabel = ref(props.field.label);
const selectedOption = ref(1);
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

const handleRadioChange = (value: string) => {
  localValue.value = value;
  emit('update:modelValue', value);
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
          class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center"
        >
          <CircleDot class="w-4 h-4 text-violet-600" />
        </div>
      </div>

      <!-- Field Type Badge -->
      <div
        class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
      >
        Radio Button
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

      <!-- Preview Radio Buttons -->
      <div class="relative">
        <div class="space-y-2">
          <label
            v-for="(option, index) in field.options || [
              'Option 1',
              'Option 2',
              'Option 3',
            ]"
            :key="index"
            class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 cursor-not-allowed"
          >
            <div class="relative">
              <CircleDot
                v-if="selectedOption === index"
                class="w-5 h-5 text-violet-500"
              />
              <Circle v-else class="w-5 h-5 text-slate-400" />
            </div>
            <span class="text-sm text-slate-700">{{ option }}</span>
          </label>
        </div>
        <div
          class="absolute inset-0 rounded-lg bg-slate-50/50 pointer-events-none"
        ></div>
      </div>

      <!-- Radio Configuration -->
      <div class="mt-2 flex items-center gap-2">
        <span class="text-xs text-slate-500">Options:</span>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(option, index) in (
              field.options || ['Option 1', 'Option 2', 'Option 3']
            ).slice(0, 3)"
            :key="index"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700"
          >
            {{ option }}
          </span>
          <span
            v-if="field.options && field.options.length > 3"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
          >
            +{{ field.options.length - 3 }} more
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
    <div class="space-y-2">
      <label
        v-for="(option, index) in field.options || ['Option 1', 'Option 2', 'Option 3']"
        :key="index"
        class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-not-allowed"
      >
        <input
          type="radio"
          :name="`preview-${field.id}`"
          :checked="index === 1"
          disabled
          class="w-4 h-4 text-green-500 focus:ring-0 cursor-not-allowed"
        />
        <span class="text-sm text-gray-700">{{ option }}</span>
      </label>
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
    <div class="space-y-2">
      <label
        v-for="(option, index) in field.options || []"
        :key="index"
        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <input
          type="radio"
          :id="`${field.id}-${index}`"
          :name="field.id"
          :value="option"
          :checked="localValue === option"
          @change="handleRadioChange(option)"
          :required="field.required && index === 0"
          class="w-4 h-4 text-green-500 focus:ring-2 focus:ring-green-200 transition-all"
        />
        <span class="text-sm text-gray-700">{{ option }}</span>
      </label>
    </div>
    <div v-if="field.helperText" class="mt-1 text-xs text-gray-500">
      {{ field.helperText }}
    </div>
  </div>
</template>
