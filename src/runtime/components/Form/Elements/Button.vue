<script setup lang="ts">
import { type PropType } from 'vue'
import type { ButtonElementData } from "../../../types";
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
  <button @click="data.onClick || console.log('Button onClick not set')" :type="data.inputType"
    v-if="!disabled">{{ data.label }}</button>
</template> 

<style></style>
