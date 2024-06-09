<script setup lang="ts">
import { type ImageInputElementData } from '~/typings';

const props = defineProps({
  data: {
    type: Object as PropType<ImageInputElementData>,
    required: true
  },
  edit: {
    type: Boolean,
    default: true
  }
})

props.data.accept = Object.values(ImageTypeEnum).join(',')

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
  <div class="flex flex-col m-auto w-[80%]">
    <label for="label">
      <input :disabled="edit" autocomplete="off" type="text" id="label" class="label" v-model="data['label']"
        placeholder="Add a label" />
    </label>
    <label for="description" v-if="data['description'] || edit">
      <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
        v-model="data['description']" placeholder="Add a description (optional)" />
    </label>
    <input autocomplete="off" v-if="!edit" type="file" @change="onChange" :accept="data.accept"/>
  </div>
</template>

<style scoped lang="scss">
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
                color: #4e4e4e;
            }

            &.label {
                font-weight: bold;
                color: black;
            }

            &.description {
                margin-bottom: 0.8em;
                font-size: 0.9rem;
                color: black;
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
</style>