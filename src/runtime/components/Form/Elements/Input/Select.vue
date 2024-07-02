<script setup lang="ts">
import {ref, type PropType} from 'vue'
import type {SelectElementData} from "../../../../types";
import {parseElementOptions} from "../../../../local";

const props = defineProps({
  edit: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object as PropType<SelectElementData>,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false
  }
})

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const emit = defineEmits<{
  delete: [idx: number]
}>()

const options = ref<{ label: string, value: string }[]>([])
parseElementOptions(props.data.options).then(_options => {
  options.value = _options || []
})

function addOption(event: any) {
  const value = event.target.value
  if (!value) return console.warn("No value provided")
  options.value.push({label: value, value: value})

  if (!props.data.options) props.data.options = []
  props.data.options.push({label: value, value: value})
  event.target.value = ''
}

function removeOption(value: string) {
  options.value = options.value!.filter(option => option.value !== value)
}

</script>
<template>
  <div class="select-container">
    <label for="select">
      <input :disabled="!edit" autocomplete="off" type="text" id="select" class="label" v-model="data.label"
             placeholder="Add a label"/>
    </label>
    <label for="description" v-if="(data.description?.length && data.description.length > 0) || edit">
      <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
             v-model="data.description" placeholder="Add a description (optional)"/>
    </label>
    <select v-if="!edit" v-model="data.value" class="select-element" ref="select" :disabled="disabled">
      <option value="" disabled selected>Select your option</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <div v-else class="adoptions">
      <div v-if="options.length > 0">
        <h3 class="current-options-heading">Current Options</h3>
        <ol class="current-options">
          <li v-for="option in options" class="">
            <div class="option">
              <span>{{ capitalise(option.value) }}</span>
              <span style="cursor: pointer">
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                     @click="removeOption(option.value)">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z"
                        fill="#d22020"/>
                </svg>
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div v-else style="margin-bottom: 2px">
        <p class="options-placeholder">No options added</p>
      </div>
      <input placeholder="Add Option" @keydown.enter="addOption" />
    </div>
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
  outline: 1px solid rgba(78, 78, 78, 0.2);
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

.adoptions input{
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e5e5;
  margin-top: 0.5rem;
}

.adoptions input::placeholder {
  color: #4e4e4e;
}

input:focus{
  outline: 1px solid rgba(78, 78, 78, 0.2);
}

.select-element{
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e5e5;
  margin-top: 0.5rem;
  width: 100%;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e5e5;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #4e4e4e;
}

.option:hover{
  background-color: #fffdfd;
}

.current-options-heading{
  color: #4e4e4e;
  font-size: 1.05rem;
  margin-bottom: -5px;
}
</style>
