<script setup lang="ts">
import { type Ref, inject } from 'vue'
import { isTextarea, isSelect, isRadio, isCheckbox, isImageInput, isFileInput } from "../../../../utils/functions";
import { disabledKey, editKey, formElementDataKey } from '../../../../utils/symbols';
import type {
  InputElementData,
} from "../../../../types";
const disabled = inject<Ref<boolean>>(disabledKey)
const edit = inject<Ref<boolean>>(editKey)
const data = inject<Ref<InputElementData>>(formElementDataKey)
</script>
<template>
  <template v-if="data">
    <FormElementsInputTextarea v-if="isTextarea(data)" />
    <FormElementsInputSelect v-else-if="isSelect(data)" />
    <FormElementsInputRadio v-else-if="isRadio(data)" />
    <FormElementsInputCheckbox v-else-if="isCheckbox(data)" />
    <FormElementsInputImage v-else-if="isImageInput(data)" />
    <FormElementsInputFile v-else-if="isFileInput(data)" />
    <FormElementsInputSelect v-else-if="isSelect(data)" />
    <div v-else>
      <label for="label">
        <input :disabled="!edit" autocomplete="off" :type="data.inputType" id="label" class="label"
          :style="{ marginBottom: (data?.description?.length || edit) ? '0rem' : '0.5rem' }" v-model="data.label"
          placeholder="Add a label" />
      </label>
      <label for="description" v-if="(data?.description && data.description.length) || edit">
        <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
          v-model="data.description" placeholder="Add a description (optional)" />
      </label>
      <input autocomplete="off" :type="data?.inputType" :accept="data?.accept" v-model="data.value" style="width: 100%" :required="!!data.rules?.find(r => r === 'required')"
        :disabled="disabled" />
    </div>
  </template>
  <div v-else>
    <p>No Form Element Data In Context</p>
  </div>
</template>
<style scoped>
input,
select,
textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

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
</style>
