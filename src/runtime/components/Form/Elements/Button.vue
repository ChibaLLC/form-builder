<script setup lang="ts">
import { inject, type Ref, type Reactive } from 'vue';
import { formElementDataKey, disabledKey } from '../../../utils/symbols';
import type { ButtonElementData } from '~/src/runtime/types';

const data = inject<Reactive<ButtonElementData>>(formElementDataKey)
const disabled = inject<Ref<boolean>>(disabledKey)
</script>

<template>
  <button @click="data?.onClick || console.log('Button onClick not set')" :type="data?.inputType" v-if="!disabled">{{
    data?.label }}</button>
</template> 

<style></style>
