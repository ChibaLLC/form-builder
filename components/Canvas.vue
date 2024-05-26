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
  type RadioElementData,
  type RichTextElementData,
  type SelectElementData,
  type StaticElementData,
  type TextareaElementData
} from "~/typings";
import { h, render } from "vue";


const FieldComponent = resolveComponent("Renderer")

const container = ref<HTMLElement | null>(null)
const dropzone = ref<HTMLElement | null>(null)
const edit = ref(true)

const props = defineProps({
  draggedElement: {
    type: Object as PropType<Ref<Field>>,
    required: false
  },
  index: {
    type: Number,
    required: true
  },
  elements: {
    type: Object as PropType<Ref<Array<FormElementData>>>,
    required: true
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
        type: Field.IMAGE as any,
        inputType: Field.IMAGE as any,
        label: '',
        accept: undefined,
      } satisfies ImageInputElementData
    }

    if (isFileInput(field)) {
      component = {
        type: Field.FILE as any,
        inputType: Field.FILE as any,
        label: '',
        accept: undefined
      } satisfies FileInputElementData
    }

    if (isCheckbox(field)) {
      component = {
        type: Field.CHECKBOX as any,
        inputType: Field.CHECKBOX as any,
        label: '',
        value: false,
        options: undefined
      } satisfies CheckboxElementData
    }

    if (isButton(field)) {
      component = {
        type: Field.BUTTON as any,
        inputType: 'submit' as any,
        label: '',
        onClick: undefined
      } satisfies ButtonElementData
    }

    if (isRadio(field)) {
      component = {
        type: Field.RADIO as any,
        inputType: Field.RADIO as any,
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
        type: Field.TEXTAREA as any,
        inputType: Field.TEXTAREA as any,
        label: '',
        placeholder: '',
        value: ''
      } satisfies TextareaElementData
    }

    if (isSelect(field)) {
      component = {
        label: '',
        type: Field.SELECT as any,
        inputType: Field.SELECT as any,
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
      const node = h(FieldComponent, {
        data: el,
        edit: edit,
        onDelete: (idx: number) => {
          this.delete(idx)
        }
      })
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
    const element = h(FieldComponent, {
      data: data,
      edit: edit,
      onDelete: (idx: number) => {
        this.delete(idx)
      }
    })
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

  delete(index: number) {
    const element = this.target.querySelector(`[data-identity="${index}"]`)
    if (element) {
      element.remove()
    }
    this._elements = this._elements.filter(el => el.index !== index)
    this.renderedElements = this.renderedElements.filter(el => el !== index)
    this.render()
    return this;
  }

  move(id: number, newIndex: number) {
    const element = this._elements[id]
    this._elements.splice(id, 1)
    this._elements.splice(newIndex, 0, element)
    this._elements = this._elements.map((el, index) => ({ ...el, index }))
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
    if (!props.draggedElement?.value) return console.warn('No dragged element')
    elements.add(props.draggedElement.value).render()
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
  <div class="w-full m-auto max-w-[800px]">
    <div class="flex justify-between">
      <div class="bg-emerald-700 text-white w-fit mb-2 mt-2 px-4 py-2 rounded cursor-pointer"  @click="edit = !edit">
        <span v-if="!edit">Edit</span>
        <span v-else>Preview</span>
      </div>
      <div class="bg-red-800 text-white w-fit ml-2 mb-2 mt-2 px-4 py-2 rounded cursor-pointer" @click="$emit('delete', index)">
        <span>Delete</span>
      </div>
    </div>
    <form class="bg-white h-fit min-h-32 rounded pb-6 relative" ref="dropzone" @submit.prevent>
      <div ref="container"></div>
    </form>
  </div>
</template>
<style scoped lang="scss">
#dropzone.active {
  @apply bg-blue-800 animate-pulse;
}
</style>