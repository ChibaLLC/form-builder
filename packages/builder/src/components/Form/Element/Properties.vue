<script setup lang="ts">
import type { FormField } from "@/types";
import {
  Settings,
  Type,
  AlignLeft,
  CheckSquare,
  Hash,
  ToggleLeft,
} from "lucide-vue-next";

interface Props {
  field: FormField;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  update: [updates: Partial<FormField>];
}>();

function updateField(key: string, value: any) {
  emit("update", { [key]: value });
}
const addOption = () => {
  if (!props.field.options) {
    props.field.options = [];
  }
  const newOptionNumber = props.field.options.length + 1;
  props.field.options.push({
    label: `Option ${newOptionNumber}`,
    value: `Option ${newOptionNumber}`,
  });
};
const removeOption = (index: number) => {
  if (props.field.options && props.field.options.length > 1) {
    props.field.options.splice(index, 1);
  }
};
// Field type configurations
const fieldTypes = {
  text: { icon: Type, label: "Text Input" },
  email: { icon: Type, label: "Email" },
  phone: { icon: Type, label: "Phone" },
  number: { icon: Hash, label: "Number" },
  longtext: { icon: AlignLeft, label: "Text Area" },
  checkbox: { icon: CheckSquare, label: "Checkbox" },
  select: { icon: ToggleLeft, label: "Dropdown" },
};
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <Settings class="w-5 h-5 text-gray-500" />
        <h3 class="font-semibold text-gray-900">Element Properties</h3>
      </div>
    </div>

    <!-- Properties Form -->
    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
      <!-- Field Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Field Type
        </label>
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <component
            :is="fieldTypes[field.type]?.icon || Type"
            class="w-5 h-5 text-gray-500"
          />
          <span class="text-sm font-medium text-gray-900">
            {{ fieldTypes[field.type]?.label || field.type }}
          </span>
        </div>
      </div>

      <!-- Label -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Label
        </label>
        <input
          :value="field.label"
          @input="
            updateField('label', ($event.target as HTMLInputElement).value)
          "
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter field label"
        />
      </div>

      <!-- Placeholder -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Placeholder
        </label>
        <input
          :value="field.placeholder"
          @input="
            updateField(
              'placeholder',
              ($event.target as HTMLInputElement).value,
            )
          "
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter placeholder text"
        />
      </div>

      <!-- Helper Text -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Helper Text
        </label>
        <textarea
          :value="field.helperText"
          @input="
            updateField(
              'helperText',
              ($event.target as HTMLTextAreaElement).value,
            )
          "
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          rows="2"
          placeholder="Add helpful instructions"
        />
      </div>

      <div>
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <span class="text-sm font-medium text-gray-700"
              >Required Field</span
            >
            <p class="text-xs text-gray-500 mt-0.5">
              Make this field mandatory
            </p>
          </div>
          <button
            @click="updateField('required', !field.required)"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              field.required ? 'bg-green-500' : 'bg-gray-300',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                field.required ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </label>
      </div>

      <div
        v-if="
          field.type === 'text' ||
          field.type === 'email' ||
          field.type === 'number'
        "
      >
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Validation
        </label>
        <div class="space-y-2">
          <!-- Min Length -->
          <div v-if="field.type === 'text'" class="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min length"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max length"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <!-- Pattern -->
          <input
            v-if="field.type === 'text'"
            type="text"
            placeholder="Regex pattern (optional)"
            class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div v-if="field.type === 'select' || field.type === 'checkbox'">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Options
        </label>
        <div class="space-y-2">
          <div
            v-for="(option, index) in field.options || []"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              :value="option.label"
              type="text"
              class="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Option label"
            />
            <button
              @click.prevent="removeOption(index)"
              class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <span class="text-sm">×</span>
            </button>
          </div>
          <button
            @click.prevent="addOption()"
            class="w-full px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            + Add Option
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="px-6 py-4 border-t border-gray-200">
      <div class="flex items-center gap-2">
        <button
          class="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Delete Field
        </button>
        <button
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Duplicate
        </button>
      </div>
    </div>
  </div>
</template>
