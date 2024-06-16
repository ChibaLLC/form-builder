<script setup lang="ts">
defineProps({
  data: {
    type: Object as PropType<ButtonElementData>,
    required: true
  }
})
</script>

<template>
  <button @click="data.onClick || (() => console.log.bind(null, 'Button onClick not set'))" :type="data.inputType as any">{{ data.text }}</button>
</template>

<style scoped lang="scss">

</style>
