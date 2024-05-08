<script setup lang="ts">
import {Field} from '~/typings';

const draggedElement = ref<Field | undefined>(undefined)

function setDragged(value: Field) {
  draggedElement.value = value
}
</script>
<template>
  <div class="flex max-w-[100svw] max-h-[100svh]">
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