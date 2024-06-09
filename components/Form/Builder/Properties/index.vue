<script setup lang="ts">
import { type CSSProperties } from "vue";
defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: true
  }
})
</script>

<template>
  <div class="properties" :style="styles">
    <h1 class="font-bold">Properties</h1>
  </div>
</template>

<style scoped lang="scss">
.properties {
  width: 100%;
  min-height: 100svh;
  background-color: #262626;
  padding: 1rem;
}
</style>