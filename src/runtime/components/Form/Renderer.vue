<script setup lang="ts">
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
  <div class="w-full m-auto max-w-[800px]">
    <form class="bg-white h-fit min-h-32 rounded relative py-2" @submit.prevent="emits('submit')">
      <FormElementsRenderer v-for="element in data" :key="element.index!" :data="element" :edit="false"/>
      <div class="w-[80%] max-w-[800px] flex justify-end m-auto">
        <button type="submit" class="px-3 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-500 transition-colors">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>
