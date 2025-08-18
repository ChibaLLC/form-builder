<script setup lang="ts">
import { computed } from 'vue';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-indigo-100 text-indigo-800 border-transparent',
        secondary: 'bg-slate-100 text-slate-900 border-transparent',
        success: 'bg-green-100 text-green-800 border-transparent',
        warning: 'bg-yellow-100 text-yellow-800 border-transparent',
        destructive: 'bg-red-100 text-red-800 border-transparent',
        outline: 'text-slate-900 border border-slate-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  class?: string;
}

const props = defineProps<BadgeProps>();

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant }), props.class)
);
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
