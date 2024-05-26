<script setup lang="ts">
defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: true
  }
})
</script>

<template>
  <div class="properties" :style="styles">
    <h1>Properties</h1>
  </div>
</template>

<style scoped lang="scss">
.properties {
  width: 100%;
  height: 100svh;
  background-color: #262626;
}
</style>