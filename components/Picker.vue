<template>
  <div class="flex cursor-pointer" draggable="true">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
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

<style scoped></style>