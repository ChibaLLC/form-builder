<script setup lang="ts">
import { type PropType, inject, type Ref } from 'vue'
import type { ButtonElementData } from "../../../types";
import { disabledKey } from '../_utils';
defineProps({
  data: {
    type: Object as PropType<ButtonElementData>,
    required: true
  }
})

const disabled = inject<Ref<boolean>>(disabledKey)
</script>

<template>
  <button @click="data.onClick || console.log('Button onClick not set')" :type="data.inputType"
    v-if="!disabled">{{ data.label }}</button>
</template> 

<style></style>
