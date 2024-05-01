<script setup lang="ts">
import {Field} from '~/typings';

const draggedElement = ref<Field | null>(null)

function setDragged(value: Field) {
  draggedElement.value = value
}
</script>
<template>
  <div class="flex w-[100svw] h-[100svh] bg-blue-400">
    <div class="flex-1">
      <Panel @dragstart="setDragged"/>
    </div>
    <div class="flex-auto">
      <Canvas :dragged-element="draggedElement"/>
    </div>
    <div class="flex-1">
      <Properties/>
    </div>
  </div>
</template>