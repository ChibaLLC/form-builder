<script setup lang="ts">
import type { StaticElementData } from '~/typings';

defineProps({
  data: {
    type: Object as PropType<StaticElementData>,
    required: true
  }
})
</script>

<template>
  <p class="static">{{ data.text }}</p>
</template>

<style scoped lang="scss"></style>