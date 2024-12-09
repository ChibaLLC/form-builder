<script setup lang="ts">
import { inject, type Ref } from 'vue'
import type {FileInputElementData} from "../../../../types";
import { editKey, disabledKey, formElementDataKey } from '../../../../utils/symbols';

const data = inject<Ref<FileInputElementData>>(formElementDataKey)

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
  if (data) data.value.value = files
}

const edit = inject<Ref<boolean>>(editKey)
const disabled = inject<Ref<boolean>>(disabledKey)
</script>

<template>
  <div class="file-container" v-if="data">
    <label for="label">
      <input :disabled="!edit" autocomplete="off" type="text" id="label" class="label" v-model="data.label"
        placeholder="Add a label" />
    </label>
    <label for="description" v-if="data.description || edit">
      <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
        v-model="data.description" placeholder="Add a description (optional)" />
    </label>
    <input autocomplete="off" type="file" :accept="data?.accept" @change="onChange" :disabled="disabled" />
  </div>
  <div v-else>
    <p>No Form Element Data In Context</p>
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
