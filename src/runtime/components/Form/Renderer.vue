<script setup lang="ts">
import { inject, type Ref, type Reactive } from 'vue'
import { disabledKey } from '../../utils/symbols';
import type { FormElementData } from '../../types';

const emits = defineEmits<{
  submit: []
  back: []
}>()

const disabled = inject<Ref<boolean>>(disabledKey)
defineProps<{
  data: Reactive<FormElementData[]>,
  active?: { pageIndex: string, data: FormElementData } | undefined,
  index: string
}>()
</script>
<template>
  <Title>Form</Title>
  <div class="form-container">
    <form class="form-renderer" @submit.prevent="emits('submit')">
      <FormElementsRenderer v-for="element in data" :key="element.index" :data="element"
        :active="index === active?.pageIndex && active.data.index === element.index" />
      <div class="form-footer" v-if="!disabled">
        <button type="button" @click="emits('back');" class="form-back-button">Back</button>
        <button type="submit" class="form-submit-button">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.form-container {
  width: 100%;
  margin: auto;
  max-width: 800px;

  transition: all 0.25s;
}

.form-renderer {
  background-color: #fff;
  height: fit-content;
  border-radius: 0.5rem;
  position: relative;
}

.form-footer {
  padding: 0 1rem;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  margin: auto;
}

.form-submit-button {
  padding: 0.5rem 1rem;
  background-color: #047857;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
  border: none;
  cursor: pointer;
}

.form-submit-button:hover {
  background-color: #065f4c;
}

.form-back-button {
  padding: 0.5rem 1rem;
  background-color: #dfdfdf;
  color: #4e4e4e;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
  border: none;
  cursor: pointer;
}

.form-back-button:hover {
  background-color: #e5e5e5;
}
</style>
