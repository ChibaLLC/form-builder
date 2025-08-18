<script setup lang="ts">
import type { FormField } from "@/types";
import { ref, watch, nextTick } from "vue";
import { Grip, Upload, Edit3, File, X } from "lucide-vue-next";

interface Props {
  field: FormField;
  isSelected?: boolean;
  isDisabled?: boolean;
  mode?: 'builder' | 'preview' | 'fill';
  modelValue?: File[] | File | null;
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  isDisabled: false,
  mode: 'builder',
  modelValue: null,
});

const emit = defineEmits<{
  "update:field": [field: FormField];
  "update:modelValue": [value: File[] | File | null];
  delete: [];
}>();

const isEditingLabel = ref(false);
const labelInput = ref<HTMLInputElement>();
const localLabel = ref(props.field.label);
const selectedFiles = ref<File[]>([]);
const fileInput = ref<HTMLInputElement>();

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

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  
  if (props.field.multiple) {
    selectedFiles.value = files;
    emit('update:modelValue', files);
  } else {
    selectedFiles.value = files.slice(0, 1);
    emit('update:modelValue', files[0] || null);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
  if (props.field.multiple) {
    emit('update:modelValue', selectedFiles.value);
  } else {
    emit('update:modelValue', selectedFiles.value[0] || null);
  }
};

const triggerFileSelect = () => {
  fileInput.value?.click();
};
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
          class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center"
        >
          <Upload class="w-4 h-4 text-blue-600" />
        </div>
      </div>

      <!-- Field Type Badge -->
      <div
        class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
      >
        File Upload
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

      <!-- Preview File Upload Area -->
      <div class="relative">
        <div
          class="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50"
        >
          <Upload class="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p class="text-sm text-slate-700 font-medium">
            {{ field.placeholder || "Click to upload or drag and drop" }}
          </p>
          <p class="text-xs text-slate-500 mt-1">
            {{ field.acceptedFormats || "PDF, DOC, DOCX, JPG, PNG (Max 10MB)" }}
          </p>
        </div>
        <div
          class="absolute inset-0 rounded-lg bg-slate-50/50 pointer-events-none"
        ></div>
      </div>

      <!-- File Configuration -->
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
        >
          <File class="w-3 h-3 mr-1" />
          {{ field.maxFiles || 1 }} file{{ field.maxFiles !== 1 ? "s" : "" }}
        </span>
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700"
        >
          Max {{ field.maxSize || "10MB" }}
        </span>
        <span
          v-if="field.multiple"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"
        >
          Multiple files
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
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 cursor-not-allowed">
      <Upload class="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p class="text-sm text-gray-600">
        {{ field.placeholder || "Click to upload or drag and drop" }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        {{ field.acceptedFormats || "PDF, DOC, DOCX, JPG, PNG (Max 10MB)" }}
      </p>
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
    
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      :id="`field-${field.id}`"
      type="file"
      :multiple="field.multiple"
      :accept="field.accept"
      :required="field.required && selectedFiles.length === 0"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <!-- Upload area -->
    <div
      @click="triggerFileSelect"
      class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-white hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <Upload class="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p class="text-sm text-gray-700 font-medium">
        {{ field.placeholder || "Click to upload or drag and drop" }}
      </p>
      <p class="text-xs text-gray-500 mt-1">
        {{ field.acceptedFormats || "PDF, DOC, DOCX, JPG, PNG (Max 10MB)" }}
      </p>
    </div>
    
    <!-- Selected files list -->
    <div v-if="selectedFiles.length > 0" class="mt-3 space-y-2">
      <div
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <File class="w-4 h-4 text-gray-500" />
          <span class="text-sm text-gray-700">{{ file.name }}</span>
          <span class="text-xs text-gray-500">({{ (file.size / 1024).toFixed(1) }} KB)</span>
        </div>
        <button
          @click.stop="removeFile(index)"
          type="button"
          class="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X class="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
    
    <div v-if="field.helperText" class="mt-1 text-xs text-gray-500">
      {{ field.helperText }}
    </div>
  </div>
</template>
