<script setup lang="ts">
import {ref, type PropType} from 'vue'
import type {CheckboxElementData} from "../../../../types";
import {parseElementOptions} from "../../../../local";

const props = defineProps({
  data: {
    type: Object as PropType<CheckboxElementData>,
    required: true
  },
  edit: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false
  }
})

function toggleHideAddOther() {
  const addOther = document.getElementById('add_other')
  if (addOther) {
    addOther.style.display = addOther.style.display === 'none' ? 'block' : 'none'
  }
}

const options = ref<{ label: string, value: string }[]>([])
parseElementOptions(props.data.options).then(_options => {
  options.value = _options
})
</script>

<template>
  <div v-for="option in options" class="checkbox-container">
    <div v-if="!edit">
      <label>{{ option.label }}</label>
      <input autocomplete="off" type="checkbox" :value="option.value"/>
    </div>
    <div v-else class="adoptions">
      <input placeholder="Add Options" @focus="toggleHideAddOther" :disabled="disabled"/>
      <button type="button" class="other">Add "Other"</button>
    </div>
  </div>
</template>

<style>
.checkbox-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
}
</style>
