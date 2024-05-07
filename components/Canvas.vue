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
  private _elements: Array<FormElementData & { index: number }> = []
  private renderedElements: Array<number> = []
  private target: HTMLElement;

  constructor(target: HTMLElement) {
    this.target = target
  }

  private initialiseElementData(field: Field) {
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

    component.index = this._elements.length
    return component as FormElementData & { index: number }
  }

  add(fieldName: Field) {
    this._elements.push(this.initialiseElementData(fieldName))
    return this;
  }

  render() {
    this._elements.map(el => {
      if (this.isRendered(el)) return
      const anchor = document.createElement('div')
      anchor.dataset.identity = el.index.toString()
      const node = h(FieldComponent, {data: el})
      render(node, anchor)
      this.renderedElements.push(el.index)
      this.target.appendChild(anchor)
    })
    return this;
  }

  isRendered(el: FormElementData) {
    return this.renderedElements.some(no => no === el.index)
  }

  update(index: number, data: FormElementData) {
    const element = h(FieldComponent, {data: data})
    const anchor = document.createElement('div')

    anchor.dataset.identity = index.toString()
    render(element, anchor)

    const replacement = this.target.querySelector(`[data-identity="${index}"]`)
    if (replacement) {
      replacement.replaceWith(anchor)
    } else {
      this.target.appendChild(anchor)
    }
    return this;
  }

  move(id: number, newIndex: number) {
    const element = this._elements[id]
    this._elements.splice(id, 1)
    this._elements.splice(newIndex, 0, element)
    this._elements = this._elements.map((el, index) => ({...el, index}))
    this.render()
    return this;
  }

  get elements() {
    return this._elements
  }

  get(index: number) {
    return this._elements[index]
  }
}

onMounted(() => {
  const elements = new Elements(container.value!)
  dropzone.value?.addEventListener('drop', (e) => {
    e.preventDefault()
    if (!props.draggedElement) return console.warn('No dragged element')
    elements.add(props.draggedElement).render()
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
    <div ref="container"></div>z
  </form>
</template>
<style>
#dropzone.active {
  @apply bg-blue-800;
}
</style>