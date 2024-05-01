<script setup lang="ts">
import {
  Field,
  type ElementOptions,
  type FormElementData,
  isCheckbox,
  isRadio,
  isRichText,
  isSelect,
  isTextarea,
  isStatic,
  isButton,
  isInput,
  isFileInput,
  isImageInput
} from "~/typings";

const props = defineProps({
  data: {
    type: Object as PropType<FormElementData>,
    required: true
  }
})

async function parseOptions(options: ElementOptions): Promise<{ label: string, value: string }[]> {
  function format(item: any) {
    if (Array.isArray(item)) {
      return item.map((option) => {
        if (typeof option === 'string') {
          return {label: option, value: option}
        } else {
          if (option.label && option.value) {
            return option
          } else {
            return Object.keys(option).map((key) => ({label: key, value: option[key]}))
          }
        }
      })
    }

    if (typeof item === 'string') {
      try {
        return format(JSON.parse(item))
      } catch (e) {
        return item.split(', ').map((option) => ({label: option, value: option}))
      }
    }

    if (typeof item === 'object') {
      if (item.label && item.value) {
        return [item]
      } else {
        return Object.keys(item).map((key) => ({label: key, value: item[key]}))
      }
    }

    console.warn("Un-parsable options")
    return []
  }

  switch (typeof options) {
    case 'function':
      return Promise.resolve(options()).then(parseOptions)
    case 'string':
      if (options.startsWith('http')) {
        try {
          return await $fetch<string>(options, {responseType: 'text'}).then(format)
        } catch (e) {
          return []
        }
      } else {
        try {
          return format(options)
        } catch (e) {
          return []
        }
      }
    case 'object':
      return format(options)
    default:
      return []
  }
}

switch (props.element.type) {
  case Field.SELECT:
  case Field.RADIO:
  case Field.CHECKBOX:
    props.element.options = await parseOptions(props.element.options)
    break
}
</script>
<template>
  <template v-if="isImageInput(props.type)">
    <input type="file"/>
  </template>
  <template v-else-if="isInput(props.type)">
    <input type="date"/>
  </template>
  <template v-else-if="isStatic(props.type)">
    <p>{{ data.text }}</p>
  </template>
  <template v-else-if="isTextarea(props.type)">
    <textarea></textarea>
  </template>
  <template v-else-if="isSelect(props.type)">
    <select>
      <option v-for="option in data.options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </template>
  <template v-else-if="isRadio(props.type)">
    <div v-for="option in data.options">
      <input type="radio" :value="option.value"/>
      <label>{{ option.label }}</label>
    </div>
  </template>
  <template v-else-if="isCheckbox(props.type)">
    <div v-for="option in data.options">
      <input type="checkbox" :value="option.value"/>
      <label>{{ option.label }}</label>
    </div>
  </template>
  <template v-else-if="isFileInput(props.type)">
    <input type="file"/>
  </template>
  <template v-else-if="isInput(props.type)">
    <input :type="data.type"/>
  </template>
  <template v-else-if="isButton(props.type)">
    <button @click="data.onClick || (() => {})" :type="data.inputType">{{ data.text }}</button>
  </template>
  <template v-else>
    <p>Unknown element type</p>
  </template>
</template>