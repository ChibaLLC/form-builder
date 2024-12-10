<script setup lang="ts">
import { type Ref, inject, type Reactive } from 'vue'
import type {RadioElementData} from "../../../../types";
import { editKey, formElementDataKey } from '../../../../utils/symbols';


const edit = inject<Ref<boolean>>(editKey)
const data = inject<Reactive<RadioElementData>>(formElementDataKey)
</script>

<template>
  <div class="radio-container" v-if="data">
    <div v-if="!edit" v-for="option in data?.options">
      <label>{{ option.label }}</label>
      <input autocomplete="off" type="radio" :value="option.value" />
    </div>
    <div v-else class="adoptions">

    </div>
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
ol{
  list-style: none;
}

a{
  text-decoration: none;
}

.radio-container{
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
