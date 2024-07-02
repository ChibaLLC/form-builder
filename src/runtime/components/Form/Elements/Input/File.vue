<script setup lang="ts">
import { type PropType } from 'vue'
import type {FileInputElementData} from "../../../../types";

const props = defineProps({
  edit: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object as PropType<FileInputElementData>,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
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
  <div class="file-container">
    <label for="label">
      <input :disabled="!edit" autocomplete="off" type="text" id="label" class="label" v-model="data['label']"
             placeholder="Add a label"/>
    </label>
    <label for="description" v-if="data.description || edit">
      <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
             v-model="data.description" placeholder="Add a description (optional)"/>
    </label>
    <input autocomplete="off" type="file" :accept="data.accept" @change="onChange" :disabled="disabled"/>
  </div>
</template>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

ul,
ol{
  list-style: none;
}

a{
  text-decoration: none;
}

.file-container{
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
}
</style>
