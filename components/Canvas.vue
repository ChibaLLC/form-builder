<script setup lang="ts">
import {
  type ButtonElementData,
  type CheckboxElementData,
  Field,
  type FileInputElementData,
  type FormElementData,
  type ImageInputElementData,
  type InputElementData,
  isButton,
  isCheckbox,
  isFileInput,
  isImageInput,
  isInput,
  isRadio,
  isRichText,
  isSelect,
  isStatic,
  isTextarea,
  type RadioElementData, type RichTextElementData,
  type SelectElementData,
  type StaticElementData,
  type TextareaElementData
} from "~/typings";
import {h, render} from "vue";
import type {VNode} from "@vue/runtime-core";

const FieldComponent = resolveComponent("Renderer")

const container = ref<HTMLElement | null>(null)
const dropzone = ref<HTMLElement | null>(null)

const props = defineProps({
  draggedElement: {
    type: String as PropType<Field>,
    required: false
  }
})

class Elements {
  dataElements: FormElementData[] = []
  elements: Array<{ index: number, node: VNode }> = []

  initialiseElementData(field: Field) {
    let component = {} as any
    if (isInput(field)) {
      component = {
        inputType: field,
        type: field,
        label: '',
        placeholder: '',
        value: '',
      } satisfies InputElementData
    }

    if (isImageInput(field)) {
      component = {
        type: Field.IMAGE,
        inputType: Field.IMAGE,
        label: '',
        accept: undefined
      } satisfies ImageInputElementData
    }

    if (isFileInput(field)) {
      component = {
        type: Field.FILE,
        inputType: Field.FILE,
        label: '',
        accept: undefined
      } satisfies FileInputElementData
    }

    if (isCheckbox(field)) {
      component = {
        type: Field.CHECKBOX,
        inputType: Field.CHECKBOX,
        label: '',
        value: false,
        options: undefined
      } satisfies CheckboxElementData
    }

    if (isButton(field)) {
      component = {
        type: Field.BUTTON,
        inputType: 'submit',
        label: '',
        onClick: undefined
      } satisfies ButtonElementData
    }

    if (isRadio(field)) {
      component = {
        type: Field.RADIO,
        inputType: Field.RADIO,
        label: '',
        value: '',
        options: undefined
      } satisfies RadioElementData
    }

    if (isStatic(field)) {
      component = {
        type: Field.STATIC,
        text: ''
      } satisfies StaticElementData
    }

    if (isTextarea(field)) {
      component = {
        type: Field.TEXTAREA,
        inputType: Field.TEXTAREA,
        label: '',
        placeholder: '',
        value: ''
      } satisfies TextareaElementData
    }

    if (isSelect(field)) {
      component = {
        type: Field.SELECT,
        inputType: Field.SELECT,
        options: undefined
      } satisfies SelectElementData
    }

    if (isRichText(field)) {
      component = {
        type: Field.RICHTEXT,
        label: ""
      } satisfies RichTextElementData
    }

    component.index = this.dataElements.length
    return component as FormElementData
  }

  add(fieldName: Field) {
    const data = this.initialiseElementData(fieldName)
    const node = h(FieldComponent, {data: data})
    this.elements.push({index: data.index || this.elements.length, node: node})
  }

  render(target: HTMLElement) {
    this.elements.map(el => {
      const anchor = document.createElement('div')
      anchor.dataset.identity = el.index.toString()
      render(el.node, anchor)
      target.appendChild(anchor)
    })
  }

  update(index: number, data: FormElementData){

  }
}

onMounted(() => {
  dropzone.value?.addEventListener('drop', (e) => {
    e.preventDefault()
    if (!props.draggedElement) return console.warn('No dragged element')

    dropzone.value?.classList.remove('active')
  })

  dropzone.value?.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropzone.value?.classList.add('active')
  })

  dropzone.value?.addEventListener('dragleave', (e) => {
    e.preventDefault()
    dropzone.value?.classList.remove('active')
  })
})
</script>
<template>
  <form class="bg-blue-950 h-fit min-h-32 rounded mt-8" ref="dropzone">
    <div ref="container">

    </div>
  </form>
</template>
<style>
#dropzone.active {
  @apply bg-blue-800;
}
</style>