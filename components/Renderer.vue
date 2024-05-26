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

const _edit = ref(props.edit.value)

function parseOptions(options: ElementOptions | undefined): Promise<{ label: string, value: string }[]> {
  if (options === undefined) return Promise.resolve([])

  function format(item: any) {
    if (Array.isArray(item)) {
      return item.map((option) => {
        if (typeof option === 'string') {
          return { label: option, value: option }
        } else {
          if (option.label && option.value) {
            return option
          } else {
            return Object.keys(option).map((key) => ({ label: key, value: option[key] }))
          }
        }
      })
    }

    if (typeof item === 'string') {
      try {
        return format(JSON.parse(item))
      } catch (e) {
        return item.split(', ').map((option) => ({ label: option, value: option }))
      }
    }

    if (typeof item === 'object') {
      if (item.label && item.value) {
        return [item]
      } else {
        return Object.keys(item).map((key) => ({ label: key, value: item[key] }))
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
          return $fetch<string>(options, { responseType: 'text' }).then(format)
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

function needsOptions(data: FormElementData): data is SelectElementData | RadioElementData | CheckboxElementData {
  switch (data.type) {
    case Field.SELECT:
    case Field.RADIO:
    case Field.CHECKBOX:
      return true;
    default:
      return false;
  }
}

if (needsOptions(props.data)) {
  parseOptions(props.data.options)
    .then(options => {
      // @ts-ignore
      // Also, illegal vue operation btw
      props.data.options = options
    })
}

watch(props.edit, (value) => {
  _edit.value = value
})

const emit = defineEmits<{
  delete: [idx: number]
}>()

function toggleHideAddOther() {
  const addOther = document.getElementById('add_other')
  if (addOther) {
    addOther.style.display = addOther.style.display === 'none' ? 'block' : 'none'
  }
}

// @ts-ignore
const _options = ref<{ label: string, value: string }[]>(props.data.options || [])

const options = computed({
  get: () => {
    return _options.value
  },
  set: (value) => {
    // @ts-ignore
    props.data.options = value
    _options.value = value
  }
})

function addOption(event: any) {
  const value = event.target.value
  if (!value) return console.warn("No value provided")
  options.value.push({ label: value, value: value })
  event.target.value = ''
}

function removeOption(value: string) {
  options.value = options.value!.filter(option => option.value !== value)
}
</script>
<template>
  <div class="container relative">
    <div class="cursor-pointer relative" @click="emit('delete', data.index! as any)" v-if="_edit">
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        class="right-0 absolute top-4">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z"
          fill="#d22020" />
      </svg>
    </div>
    <div v-if="isStatic(data.type)">
      <p class="static">{{ data["text"] }}</p>
    </div>

    <div v-else-if="isImageInput(data.type)">
      <label for="label">
        <input :disabled="_edit" autocomplete="off" type="text" id="label" class="label" v-model="data['label']"
          placeholder="Add a label" />
      </label>
      <label for="description" v-if="data['description'] || edit">
        <input :disabled="!_edit" autocomplete="off" type="text" id="description" class="description"
          v-model="data['description']" placeholder="Add a description (optional)" />
      </label>
      <input autocomplete="off" v-if="!_edit" type="file" />
    </div>

    <div v-else-if="isTextarea(data.type)">
      <label for="textarea">
        <input :disabled="!_edit" autocomplete="off" type="text" id="textarea" class="label" v-model="data['label']"
          placeholder="Add a label" />
      </label>
      <label for="description" v-if="data['description'] || edit">
        <input :disabled="!_edit" autocomplete="off" type="text" id="description" class="description"
          v-model="data['description']" placeholder="Add a description (optional)" />
      </label>
      <textarea class="textarea"></textarea>
    </div>

    <div v-else-if="isSelect(data.type)">
      <label for="select">
        <input :disabled="!_edit" autocomplete="off" type="text" id="select" class="label" v-model="data['label']"
          placeholder="Add a label" />
      </label>
      <label for="description" v-if="data['description'] || edit">
        <input :disabled="!_edit" autocomplete="off" type="text" id="description" class="description"
          v-model="data['description']" placeholder="Add a description (optional)" />
      </label>
      <select v-if="!_edit">
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <div v-else class="adoptions">
        <div v-if="options.length > 0" class="mb-4">
          <h3 class="text-gray-400 text-sm">Current Options</h3>
          <ol class="text-gray-400 list-decimal ml-4 text-sm">
            <li v-for="option in options" class="p-0.5 hover:bg-gray-200">
              <div class="flex align-middle justify-between px-1">
                <span>{{ capitalise(option.value) }}</span>
                <span class="cursor-pointer">
                  <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="removeOption(option.value)">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z"
                      fill="#d22020" />
                  </svg>
                </span>
              </div>
            </li>
          </ol>
        </div>
        <div v-else class="mb-2">
          <p class="text-gray-400 text-sm">No options added</p>
        </div>
        <input placeholder="Add Option" @keydown.enter="addOption" />
      </div>
    </div>

    <div v-else-if="isRadio(data.type)">
      <div>
        <div v-if="!_edit" v-for="option in data['options']">
          <label>{{ option.label }}</label>
          <input autocomplete="off" type="radio" :value="option.value" />
        </div>
        <div v-else class="adoptions">

        </div>
      </div>
    </div>

    <div v-else-if="isCheckbox(data.type)">
      <div v-for="option in data['options']">
        <div v-if="!_edit">
          <label>{{ option.label }}</label>
          <input autocomplete="off" type="checkbox" :value="option.value" />
        </div>
        <div v-else class="adoptions">
          <input placeholder="Add Options" @focus="toggleHideAddOther" />
          <button type="button" class="other">Add "Other"</button>
        </div>
      </div>
    </div>

    <div v-else-if="isFileInput(data.type)">
      <label for="label">
        <input :disabled="!_edit" autocomplete="off" type="text" id="label" class="label" v-model="data['label']"
          placeholder="Add a label" />
      </label>
      <label for="description" v-if="data['description'] || edit">
        <input :disabled="!_edit" autocomplete="off" type="text" id="description" class="description"
          v-model="data['description']" placeholder="Add a description (optional)" />
      </label>
      <input autocomplete="off" type="file" :accept="data['accept']" />
    </div>

    <div v-else-if="isButton(data.type)">
      <button @click="data['onClick'] || (() => { })" :type="data['inputType'] as any">{{ data['text'] }}</button>
    </div>

    <div v-else-if="isInput(data.type)">
      <label for="label">
        <input :disabled="!_edit" autocomplete="off" type="text" id="label" class="label" v-model="data['label']"
          placeholder="Add a label" />
      </label>
      <label for="description" v-if="data['description'] || edit">
        <input :disabled="!_edit" autocomplete="off" type="text" id="description" class="description"
          v-model="data['description']" placeholder="Add a description (optional)" />
      </label>
      <input autocomplete="off" :type="data['inputType']" />
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

  >div {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 80%;

    >input,
    >select,
    >textarea {
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

    &.adoptions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .adoptions {
    input {
      all: unset;
      width: 100px;

      &::placeholder {
        color: #4e4e4e;
        text-decoration: underline;

      }

      &:focus {
        cursor: text;
        background-color: #f0f0f0;
        border-radius: 0.25rem;
        padding: 0.5rem;
        color: black !important;
        width: fit-content;
        margin-right: 1rem;

        transition: padding 0.25s, border-radius 0.25s;

        &::placeholder {
          text-decoration: none;
        }
      }
    }

    .other {
      color: black;
      font-weight: 400;
    }
  }
}
</style>