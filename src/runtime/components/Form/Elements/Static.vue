<script setup lang="ts">
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
