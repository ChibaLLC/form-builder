<script setup lang="ts">
import { inject, type Ref } from 'vue';
import { formElementDataKey } from '../../../utils/symbols';
import type { StaticElementData } from '~/src/runtime/types';

const data = inject<Ref<StaticElementData>>(formElementDataKey)
</script>

<template>
  <p class="static">{{ data?.text }}</p>
</template>

<style scoped></style>
