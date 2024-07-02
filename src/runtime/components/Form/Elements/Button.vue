<script setup lang="ts">
import { type PropType } from 'vue'
import type {ButtonElementData} from "../../../types";
defineProps({
  data: {
    type: Object as PropType<ButtonElementData>,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>

<template>
  <button @click="data.onClick || (() => console.log.bind(null, 'Button onClick not set'))" :type="data.inputType as any" v-if="!disabled">{{ data.text }}</button>
</template>

<style>

</style>
