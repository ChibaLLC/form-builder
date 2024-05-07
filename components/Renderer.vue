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
  isImageInput,
  type SelectElementData,
  type RadioElementData,
  type CheckboxElementData
} from "~/typings";
import {render} from "vue";

const props = defineProps({
  data: {
    type: Object as PropType<FormElementData>,
    required: true
  },
  edit: {
    type: Object as PropType<Ref<boolean>>,
    default: true
  }
})

const _edit = ref(!props.edit.value)

function parseOptions(options: ElementOptions | undefined): Promise<{ label: string, value: string }[]> {
  if (options === undefined) return Promise.resolve([])

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
          return $fetch<string>(options, {responseType: 'text'}).then(format)
        } catch (e) {
          return Promise.resolve([])
        }
      } else {
        try {
          return Promise.resolve(format(options))
        } catch (e) {
          return Promise.resolve([])
        }
      }
    case 'object':
      return Promise.resolve(format(options))
    default:
      return Promise.resolve([])
  }
}

function hasOptions(data: FormElementData): data is SelectElementData | RadioElementData | CheckboxElementData {
  switch (data.type) {
    case Field.SELECT:
    case Field.RADIO:
    case Field.CHECKBOX:
      return true;
    default:
      return false;
  }
}

if (hasOptions(props.data)) {
  parseOptions(props.data.options)
      .then(options => {
        // @ts-ignore
        props.data.options = options
      })
}

watch(props.edit, (value) => {
  _edit.value = !value
})
</script>
<template>
  <div class="container">
    <div>

    </div>
    <div v-if="isStatic(data.type)">
      <p class="static">{{ data.text }}</p>
    </div>

    <div v-else-if="isImageInput(data.type)">
      <label for="label">
        <input :disabled="_edit" autocomplete="off" type="text" id="label" class="label"
               v-model="data.label" placeholder="Add a label"/>
      </label>
      <label for="description" v-if="data.description || edit">
        <input :disabled="_edit" autocomplete="off" type="text" id="description" class="description"
               v-model="data.description" placeholder="Add a description (optional)"/>
      </label>
      <input autocomplete="off" v-if="!edit" type="file"/>
    </div>

    <div v-else-if="isTextarea(data.type)">
      <label for="textarea">
        <input :disabled="_edit" autocomplete="off" type="text" id="textarea" class="label" v-model="data.label"
               placeholder="Add a label"/>
      </label>
      <label for="description" v-if="data.description || edit">
        <input :disabled="_edit" autocomplete="off" type="text" id="description" class="description"
               v-model="data.description" placeholder="Add a description (optional)"/>
      </label>
      <textarea class="textarea"></textarea>
    </div>

    <div v-else-if="isSelect(data.type)">
      <label for="select">
        <input :disabled="_edit" autocomplete="off" type="text" id="select" class="label" v-model="data.label"
               placeholder="Add a label"/>
      </label>
      <label for="description" v-if="data.description || edit">
        <input :disabled="_edit" autocomplete="off" type="text" id="description" class="description"
               v-model="data.description" placeholder="Add a description (optional)"/>
      </label>
      <select v-if="!edit">
        <option v-for="option in data.options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <div v-else class="adoptions">

      </div>
    </div>

    <div v-else-if="isRadio(data.type)">
      <div v-for="option in data.options">
        <div v-if="!edit">
          <label>{{ option.label }}</label>
          <input autocomplete="off" type="radio" :value="option.value"/>
        </div>
        <div v-else class="adoptions">

        </div>
      </div>
    </div>

    <div v-else-if="isCheckbox(data.type)">
      <div v-for="option in data.options">
        <div v-if="!edit">
          <label>{{ option.label }}</label>
          <input autocomplete="off" type="checkbox" :value="option.value"/>
        </div>
        <div v-else class="adoptions">

        </div>
      </div>
    </div>

    <div v-else-if="isFileInput(data.type)">
      <label for="label">
        <input :disabled="_edit" autocomplete="off" type="text" id="label" class="label" v-model="data.label"
               placeholder="Add a label"/>
      </label>
      <label for="description" v-if="data.description || edit">
        <input :disabled="_edit" autocomplete="off" type="text" id="description" class="description"
               v-model="data.description" placeholder="Add a description (optional)"/>
      </label>
      <input autocomplete="off" type="file" :accept="data.accept"/>
    </div>

    <div v-else-if="isButton(data.type)">
      <button @click="data.onClick || (() => { })" :type="data.inputType">{{ data.text }}</button>
    </div>

    <div v-else-if="isInput(data.type)">
      <label for="label">
        <input :disabled="_edit" autocomplete="off" type="text" id="label" class="label" v-model="data.label"
               placeholder="Add a label"/>
      </label>
      <label for="description" v-if="data.description || edit">
        <input :disabled="_edit" autocomplete="off" type="text" id="description" class="description"
               v-model="data.description" placeholder="Add a description (optional)"/>
      </label>
      <input autocomplete="off" :type="data.inputType"/>
    </div>

    <div v-else>
      <p class="text-red">Unknown element type</p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0;

  > div {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 80%;

    > input,
    > select,
    > textarea {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
    }

    label {
      width: 100%;

      &:first-child {
        margin-top: 1rem;
      }

      &:not(:focus) {
        input {
          all: unset;
          cursor: pointer;
          transition: padding 0.25s, border-radius 0.25s;
          width: 100%;
          text-wrap: normal;
          text-overflow: ellipsis;

          &::placeholder {
            color: #bbb;
          }

          &.label {
            font-weight: bold;
            color: white;
          }

          &.description {
            margin-bottom: 0.8em;
            font-size: 0.9rem;
            color: white;
          }
        }
      }

      &:focus-within,
      &:focus {
        input {
          cursor: text;
          background-color: #f0f0f0;
          border-radius: 0.25rem;
          padding: 0.5rem;
          color: black !important;
          width: fit-content;

          transition: padding 0.25s, border-radius 0.25s;
        }
      }

      &:hover:not(:focus-within) {
        input::placeholder {
          text-decoration: underline;
        }
      }
    }

    &.adoptions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}
</style>