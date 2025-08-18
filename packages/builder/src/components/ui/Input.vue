<script setup lang="ts">
import { computed, ref } from 'vue';
import { cn } from '@/lib/utils';

interface InputProps {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  class?: string;
  error?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  autofocus?: boolean;
  icon?: any;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  error: false,
  required: false,
  autofocus: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  'blur': [event: FocusEvent];
  'focus': [event: FocusEvent];
  'keydown': [event: KeyboardEvent];
}>();

const inputRef = ref<HTMLInputElement>();

const classes = computed(() =>
  cn(
    'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
    props.error
      ? 'border-red-500 text-red-900 placeholder:text-red-400 focus-visible:ring-red-500'
      : 'border-slate-300 hover:border-slate-400',
    props.icon && 'pl-10',
    props.class
  )
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<template>
  <div class="relative w-full">
    <div v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
      <component :is="icon" class="h-4 w-4" />
    </div>
    <input
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="classes"
      :id="id"
      :name="name"
      :required="required"
      :autofocus="autofocus"
      @input="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @keydown="$emit('keydown', $event)"
    />
  </div>
</template>
