<script setup lang="ts">
import type { FormField } from "@/types";
import { ref, watch, nextTick, computed } from "vue";
import {
  Grip,
  Type,
  Edit3,
  Mail,
  Phone,
  Link,
  Hash,
  Calendar,
  Clock,
} from "lucide-vue-next";

interface Props {
  field: FormField;
  isSelected?: boolean;
  isDisabled?: boolean;
  mode?: 'builder' | 'preview' | 'fill';  // New mode prop
  modelValue?: any;  // For v-model support in fill mode
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDisabled: false,
  mode: 'builder',
  modelValue: '',
});

const emit = defineEmits<{
  "update:field": [field: FormField];
  "update:modelValue": [value: any];  // For v-model support
  delete: [];
}>();

const isEditingLabel = ref(false);
const labelInput = ref<HTMLInputElement>();
const localLabel = ref(props.field.label);
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

// Compute icon and label based on input type
const fieldConfig = computed(() => {
  const type = props.field.inputType || "text";
  const configs: Record<
    string,
    { icon: any; label: string; placeholder: string; gradient: string }
  > = {
    text: {
      icon: Type,
      label: "Text Input",
      placeholder: "Enter text...",
      gradient: "from-indigo-50 to-purple-50",
    },
    email: {
      icon: Mail,
      label: "Email",
      placeholder: "name@example.com",
      gradient: "from-red-50 to-pink-50",
    },
    tel: {
      icon: Phone,
      label: "Phone",
      placeholder: "+1 (555) 000-0000",
      gradient: "from-green-50 to-emerald-50",
    },
    number: {
      icon: Hash,
      label: "Number",
      placeholder: "0",
      gradient: "from-blue-50 to-cyan-50",
    },
    url: {
      icon: Link,
      label: "URL",
      placeholder: "https://example.com",
      gradient: "from-orange-50 to-amber-50",
    },
    date: {
      icon: Calendar,
      label: "Date",
      placeholder: "Select date",
      gradient: "from-purple-50 to-pink-50",
    },
    time: {
      icon: Clock,
      label: "Time",
      placeholder: "Select time",
      gradient: "from-teal-50 to-cyan-50",
    },
    password: {
      icon: Type,
      label: "Password",
      placeholder: "••••••••",
      gradient: "from-slate-50 to-gray-50",
    },
  };

  return configs[type] || configs.text;
});

// Handle value updates in fill mode
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localValue.value = target.value;
  emit('update:modelValue', target.value);
};

// Watch for external value changes
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
          class="cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Grip class="w-4 h-4 text-slate-400 hover:text-slate-600" />
        </div>

        <!-- Field Type Icon -->
        <div
          :class="[
            'w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center',
            fieldConfig.gradient,
          ]"
        >
          <component
            :is="fieldConfig.icon"
            class="w-4 h-4"
            :class="{
              'text-indigo-600': field.inputType === 'text' || !field.inputType,
              'text-red-600': field.inputType === 'email',
              'text-green-600': field.inputType === 'tel',
              'text-blue-600': field.inputType === 'number',
              'text-orange-600': field.inputType === 'url',
              'text-purple-600': field.inputType === 'date',
              'text-teal-600': field.inputType === 'time',
              'text-slate-600': field.inputType === 'password',
            }"
          />
        </div>
      </div>

      <!-- Field Type Badge -->
      <div
        class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
      >
        {{ fieldConfig.label }}
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
          v-model="field.label"
          @blur="finishEditingLabel"
          @keyup.enter="finishEditingLabel"
          @keyup.escape="cancelEditingLabel"
          class="w-full px-2 py-1 text-sm font-semibold text-slate-700 bg-white border-2 border-indigo-200 rounded-lg outline-none focus:ring-indigo-200"
          placeholder="Field label"
        />
      </div>

      <!-- Preview Input -->
      <div class="relative">
        <div class="relative">
          <input
            :type="field.inputType || 'text'"
            :placeholder="field.placeholder || fieldConfig.placeholder"
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 cursor-not-allowed transition-all"
            :class="{
              'pl-10':
                field.inputType === 'email' ||
                field.inputType === 'tel' ||
                field.inputType === 'url',
            }"
            disabled
          />
          <!-- Input Icon -->
          <component
            v-if="
              field.inputType === 'email' ||
              field.inputType === 'tel' ||
              field.inputType === 'url'
            "
            :is="fieldConfig.icon"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          />
        </div>
        <div
          class="absolute inset-0 rounded-lg bg-slate-50/50 pointer-events-none"
        ></div>
      </div>

      <!-- Input Type Info -->
      <div
        v-if="field.inputType && field.inputType !== 'text'"
        class="mt-2 flex flex-wrap gap-1"
      >
        <span
          v-if="field.inputType === 'email'"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"
        >
          @ validation
        </span>
        <span
          v-if="field.inputType === 'tel'"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"
        >
          Phone format
        </span>
        <span
          v-if="field.inputType === 'number'"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
        >
          {{ field.min ? `Min: ${field.min}` : "Numeric" }}
        </span>
        <span
          v-if="field.inputType === 'number' && field.max"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700"
        >
          Max: {{ field.max }}
        </span>
        <span
          v-if="field.inputType === 'url'"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
        >
          URL validation
        </span>
        <span
          v-if="field.inputType === 'password'"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
        >
          {{ field.minLength ? `Min ${field.minLength} chars` : "Secure" }}
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
    <div class="relative">
      <input
        :type="field.inputType || 'text'"
        :placeholder="field.placeholder || fieldConfig.placeholder"
        class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 cursor-not-allowed"
        :class="{
          'pl-10':
            field.inputType === 'email' ||
            field.inputType === 'tel' ||
            field.inputType === 'url',
        }"
        disabled
      />
      <component
        v-if="
          field.inputType === 'email' ||
          field.inputType === 'tel' ||
          field.inputType === 'url'
        "
        :is="fieldConfig.icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
      />
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
    <div class="relative">
      <input
        :id="`field-${field.id}`"
        :type="field.inputType || 'text'"
        :value="localValue"
        @input="handleInput"
        :placeholder="field.placeholder || fieldConfig.placeholder"
        :required="field.required"
        :min="field.min"
        :max="field.max"
        :minlength="field.minLength"
        :maxlength="field.maxLength"
        :pattern="field.pattern"
        class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        :class="{
          'pl-10':
            field.inputType === 'email' ||
            field.inputType === 'tel' ||
            field.inputType === 'url',
        }"
      />
      <component
        v-if="
          field.inputType === 'email' ||
          field.inputType === 'tel' ||
          field.inputType === 'url'
        "
        :is="fieldConfig.icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
      />
    </div>
    <div v-if="field.helperText" class="mt-1 text-xs text-gray-500">
      {{ field.helperText }}
    </div>
  </div>
</template>
