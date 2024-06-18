<script setup lang="ts">
import { type PropType } from 'vue'
import type { FormElementData } from '../../typings'

defineProps({
  data: {
    type: Object as PropType<FormElementData[]>,
    required: true
  }
})

const emits = defineEmits<{
  submit: []
}>()
</script>
<template>
  <Title>Form</Title>
  <div class="form-container">
    <form class="form-renderer" @submit.prevent="emits('submit')">
      <FormElementsRenderer v-for="element in data" :key="element.index!" :data="element" :edit="false"/>
      <div class="form-footer">
        <button type="submit" class="form-submit-button">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.form-container{
  width: 100%;
  margin: auto;
  max-width: 800px;
}

.form-renderer{
  background-color: #fff;
  height: fit-content;
  min-height: 32rem;
  border-radius: 0.5rem;
  position: relative;
  padding: 1rem 0;
}

.form-footer{
  width: 80%;
  max-width: 800px;
  display: flex;
  justify-content: flex-end;
  margin: auto;
}

.form-submit-button{
  padding: 0.5rem 1rem;
  background-color: #047857;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
}

.form-submit-button:hover{
  background-color: #065f4c;
}
</style>
