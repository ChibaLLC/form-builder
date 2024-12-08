<script setup lang="ts">
import { type PropType, type Ref, inject } from 'vue'
import type {TextareaElementData} from "../../../../types";
import { editKey, disabledKey } from '../../_utils';

defineProps({
    data: {
        type: Object as PropType<TextareaElementData>,
        required: true
    }
})

const edit = inject<Ref<boolean>>(editKey)
const disabled = inject<Ref<boolean>>(disabledKey)
</script>

<template>
    <div class="textarea-container">
        <label for="textarea">
            <input :disabled="!edit" autocomplete="off" type="text" id="textarea" class="label" v-model="data.label"
                placeholder="Add a label" />
        </label>
        <label for="description" v-if="data.description || edit">
            <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
                v-model="data.description" placeholder="Add a description (optional)" />
        </label>
        <textarea class="textarea" v-model="data.value" style="width: 100%" :disabled="disabled"></textarea>
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
ol{
  list-style: none;
}

a{
  text-decoration: none;
}

.textarea-container{
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
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

label:focus-within input, label:focus input {
  cursor: text;
  border-radius: 0.25rem;
  outline: 1px solid rgba(78, 78, 78, 0.4);
  background-color: white;
  padding: 0.5rem;
  width: fit-content;
  transition: padding 0.25s, border-radius 0.25s;
}


label:focus-within input::placeholder, label:focus input::placeholder {
  text-decoration: none;
}

label:hover:not(:focus-within) input::placeholder {
  text-decoration: underline;
}
</style>
