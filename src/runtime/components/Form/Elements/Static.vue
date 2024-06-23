<script setup lang="ts">
import { type PropType } from 'vue'
import type {StaticElementData} from "../../../types";

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

<style scoped></style>
