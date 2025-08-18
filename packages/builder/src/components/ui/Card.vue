<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface CardProps {
  class?: string;
  hover?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const props = withDefaults(defineProps<CardProps>(), {
  hover: false,
  shadow: 'sm',
  padding: 'md',
});

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const classes = computed(() =>
  cn(
    'rounded-xl bg-white border border-slate-200',
    shadowClasses[props.shadow],
    paddingClasses[props.padding],
    props.hover && 'transition-all hover:shadow-lg hover:border-slate-300',
    props.class
  )
);
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Card',
};
</script>
