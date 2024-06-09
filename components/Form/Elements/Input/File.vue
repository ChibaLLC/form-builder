<script setup lang="ts">
import type { FileInputElementData } from '~/typings';

const props = defineProps({
  edit: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object as PropType<FileInputElementData>,
    required: true
  }
})

const emit = defineEmits<{
  delete: [idx: number]
}>()

function onChange(event: any) {
  const files = event.target.files
  if (!files) return console.warn("No files provided")

  for (let i = 0; i < files.length; i++) {
    if (typeof files[i] !== 'object') {
      console.warn("Invalid file provided, purging...")
      files.splice(i, 1)
    }
  }

  if (files.length === 0) return console.warn("No valid files provided")
  props.data.value = files
}
</script>

<template>
  <div class="flex flex-col m-auto w-[80%]">
    <label for="label">
      <input :disabled="!edit" autocomplete="off" type="text" id="label" class="label" v-model="data['label']"
             placeholder="Add a label"/>
    </label>
    <label for="description" v-if="data.description || edit">
      <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
             v-model="data.description" placeholder="Add a description (optional)"/>
    </label>
    <input autocomplete="off" type="file" :accept="data.accept" @change="onChange"/>
  </div>
</template>

<style scoped lang="scss">

</style>