<script setup lang="ts">
import { defineComponent, inject, type PropType, h, type Ref, reactive, computed, watch } from 'vue'
import type { CheckboxElementData } from "../../../../types";
import { disabledKey, editKey, formElementDataKey } from '../../../../utils/symbols';

const data = inject<Ref<CheckboxElementData>>(formElementDataKey);
if (data) {
  data.value.options = reactive(data.value.options || [])
  data.value.value = reactive(data.value.value || {})
  data.value.multiple = false
}
function addOption(event: Event) {
  const value = (event.target as HTMLInputElement)?.value
  if (!value) return console.warn("No value provided")

  data?.value.options?.push({ label: value, value: value });
  (event.target as HTMLInputElement).value = ''
}

function removeOption(value: string) {
  if (!data) return
  const index = data.value.options?.findIndex(d => d.value === value)
  if (index !== undefined && index >= 0) {
    data.value.options?.splice(index, 1)
  }
}

function deleteValues<T extends Object>(obj: T, key?: keyof T) {
  if (!obj) return
  if (!key) {
    for (const key in obj) {
      delete obj[key]
    }
  } else {
    if (obj[key]) {
      delete obj[key]
    }
  }
}

const Option = defineComponent({
  props: {
    option: {
      type: Object as PropType<{ label: string, value: string }>,
      required: true
    }
  },
  setup(props) {
    const data = inject<Ref<CheckboxElementData>>(formElementDataKey);
    if (!data) return console.warn("No Element Data Found For Option")
    const disabled = inject<Ref<boolean>>(disabledKey)

    const checked = computed({
      get() {
        const value = data.value.value?.[props.option.label]
        return value === props.option.value
      },
      set(val) {
        if (!data.value.value) data.value.value = {}
        if (val) {
          if (!data.value.multiple) {
            deleteValues(data.value.value)
          }
          data.value.value[props.option.label] = props.option.value
        } else {
          if (data.value.multiple) {
            deleteValues(data.value.value, props.option.label)
          } else {
            deleteValues(data.value.value)
          }
        }
      }
    })

    function onInput(e: Event) {
      const target = e.target as HTMLInputElement
      if (target.checked) {
        checked.value = true
      } else {
        checked.value = false
      }
    }

    return { checked, onInput, disabled, data }
  },
  render() {
    const input = h('input', { onChange: this.onInput, checked: this.checked, type: 'checkbox', style: { cursor: "pointer" }, disabled: this.disabled, required: !!this.data.rules?.find(r => r === 'required') })
    const label = h('label', { onClick: () => { input.el!.click() }, style: { cursor: "pointer", outline: "none" } }, this.$props.option.label)
    return h('div', { class: 'option' }, [input, label])
  }
})

const edit = inject<Ref<boolean>>(editKey)
</script>

<template>
  <div class="checkbox-container" v-if="data">
    <label for="select">
      <input :disabled="!edit" autocomplete="off" type="text" id="select" class="label" v-model="data.label"
        placeholder="Add a label" />
    </label>
    <label for="description" v-if="(data?.description?.length && data.description.length > 0) || edit">
      <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
        v-model="data.description" placeholder="Add a description (optional)" />
    </label>
    <div v-if="data.options?.length" class="options">
      <div v-for="option in data?.options" class="option">
        <Option :option="option" />
        <span style="cursor: pointer; margin-left: auto; margin-right: 0.35rem;" v-if="edit">
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            @click="removeOption(option.value)">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z"
              fill="#d22020" />
          </svg>
        </span>
      </div>
    </div>
    <div v-else>
      <p>No options added.</p>
    </div>
    <div class="adoptions" v-if="edit">
      <input placeholder="Add Options" @keydown.enter="addOption" />
    </div>
    <div v-if="edit"
      style="margin-top: 1rem; margin-left: 0.1rem; display: flex; gap: 0.25rem; align-items: center; width: fit-content;">
      <input type="checkbox" id="allow_multiple" v-model="data.multiple" style="cursor: pointer;" />
      <label for="allow_multiple" style="margin: 0;">
        <small style="font-size: 14px; cursor: pointer;" @click="data.multiple && deleteValues(data.value || {})">Allow
          multiple selection</small>
      </label>
    </div>
  </div>
  <div v-else>
    <p>No Form Element Data In Context</p>
  </div>
</template>

<style scoped>
.checkbox-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
}

.adoptions input {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e5e5;
  margin-top: 0.5rem;
}

.adoptions input::placeholder {
  color: #4e4e4e;
}

.adoptions input:focus {
  outline: 1px solid rgba(78, 78, 78, 0.2);
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


.checkbox-container:hover label:focus-within input,
.checkbox-container:hover label:focus input:hover {
  outline: 1px solid rgba(78, 78, 78, 0.1);
}

label:focus-within input,
label:focus input {
  cursor: text;
  border-radius: 0.25rem;
  outline: 1px solid rgba(78, 78, 78, 0.2);
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

.options {
  margin-top: 10px;
  margin-left: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 5px;
}

.option:hover {
  background-color: #fffdfd;
}
</style>
