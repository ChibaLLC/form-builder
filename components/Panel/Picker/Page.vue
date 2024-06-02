<template>
  <div class="flex cursor-pointer hover:bg-[#2b2a2a] rounded-md p-1.5" draggable="true">
    <div class="text">
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="description">
        <slot name="description"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
<script setup lang="ts">
defineProps()
</script>