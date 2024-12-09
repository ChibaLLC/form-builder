<script setup lang="ts">
import { inject, type Ref } from 'vue'
import type { ImageInputElementData } from "../../../../types";
import { ImageTypeEnum } from "../../../../utils/constants";
import { editKey, disabledKey, formElementDataKey } from '../../../../utils/symbols';

const data = inject<Ref<ImageInputElementData>>(formElementDataKey)
if (data) data.value.accept = Object.values(ImageTypeEnum).join(',')

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
  if (data?.value) data.value.value = files
}

const edit = inject<Ref<boolean>>(editKey)
const disabled = inject<Ref<boolean>>(disabledKey)
</script>

<template>
  <div class="images-container" v-if="data">
    <label for="label">
      <input :disabled="edit" autocomplete="off" type="text" id="label" class="label" v-model="data.label"
        placeholder="Add a label" />
    </label>
    <label for="description" v-if="data['description'] || edit">
      <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
        v-model="data.description" placeholder="Add a description (optional)" />
    </label>
    <input autocomplete="off" v-if="!edit" type="file" @change="onChange" :accept="data?.accept" style="width: 100%"
      :required="!!data.rules?.find(r => r === 'required')" :disabled="disabled" />
  </div>
  <div v-else>
    <p>No Form Element Data In Context</p>
  </div>
</template>

<style scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
}

.images-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
}

.select-container {
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
}

.select-element {
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  padding: 1rem;
}

.current-options-heading {
  font-size: 0.8rem;
  color: gray;
  margin: 0;
}

.current-options {
  color: gray;
  list-style: decimal;
  margin-left: 4px;
  font-size: 0.8rem;
}

.current-options li {
  padding: 0 5px;
  width: 40%;
  border-radius: 2px;
  margin-left: 1.5rem;
  margin-right: 4.1rem;
}

.current-options li:hover {
  background-color: #fffdfd;
}

.current-options .option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.options-placeholder {
  color: #4e4e4e;
  font-size: 0.8rem;
}

label {
  width: 100%;
}

label:first-child {
  margin-top: 1rem;
}

label:not(:focus) input {
  all: unset;
  cursor: pointer;
  transition: padding 0.25s, border-radius 0.25s;
  width: 100%;
  text-wrap: unset;
  text-overflow: ellipsis;
}

label:not(:focus) input::placeholder {
  color: #4e4e4e;
}

label:not(:focus) input.label {
  font-weight: bold;
  color: black;
}

label:not(:focus) input.description {
  margin-bottom: 0.8em;
  font-size: 0.9rem;
  color: black;
}

.select-container:hover label:focus-within input,
.select-container:hover label:focus input:hover {
  outline: 1px solid rgba(78, 78, 78, 0.1);
}

label:focus-within input,
label:focus input {
  cursor: text;
  border-radius: 0.25rem;
  outline: 1px solid rgba(78, 78, 78, 0.4);
  background-color: white;
  padding: 0.5rem;
  width: fit-content;
  transition: padding 0.25s, border-radius 0.25s;
}


label:focus-within input::placeholder,
label:focus input::placeholder {
  text-decoration: none;
}

label:hover:not(:focus-within) input::placeholder {
  text-decoration: underline;
}

.adoptions input {
  all: unset;
  width: 100px;
}

.adoptions input::placeholder {
  color: #4e4e4e;
  text-decoration: underline;
}

.adoptions input:focus {
  cursor: text;
  background-color: #f0f0f0;
  border-radius: 0.25rem;
  padding: 0.5rem;
  color: black !important;
  width: fit-content;
  margin-right: 1rem;
  transition: padding 0.25s, border-radius 0.25s;
}

.adoptions input:focus::placeholder {
  text-decoration: none;
}

.adoptions .other {
  color: black;
  font-weight: 400;
}
</style>
