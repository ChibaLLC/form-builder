<script setup lang="ts">
import {h, render, ref, type PropType, type Ref, resolveComponent, onMounted} from "vue";
import {Field} from '../../../utils/constants'
import type {
  ButtonElementData,
  CheckboxElementData,
  FileInputElementData,
  FormElementData,
  ImageInputElementData,
  InputElementData, RadioElementData, RichTextElementData, SelectElementData, StaticElementData, TextareaElementData
} from "../../../typings";
import {
  isInput,
  isFileInput,
  isImageInput,
  isButton,
  isCheckbox,
  isRadio,
  isRichText,
  isSelect,
  isStatic,
  isTextarea
} from "../../../utils/functions.js";


const FieldComponent = resolveComponent("FormElementsRenderer")

const container = ref<HTMLElement | null>(null)
const dropzone = ref<HTMLElement | null>(null)
const edit = ref(true)
const movingElement = ref<HTMLElement | null>(null)
const latestEnter = ref<HTMLElement | null>(null)

const props = defineProps({
  draggedElement: {
    type: Object as PropType<Ref<keyof typeof Field | undefined>>,
    required: false
  },
  index: {
    type: Number,
    required: true
  }
})

class Elements {
  private _elements: Array<FormElementData & { index: number }> = []
  private renderedElements: Array<number> = []
  private target: HTMLElement
  private _onAdd = {
    add: [] as Array<Function>,
    delete: [] as Array<Function>,
    update: [] as Array<Function>
  }

  constructor(target: HTMLElement) {
    this.target = target
  }

  private initialiseElementData(field: keyof typeof Field) {
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
        value: undefined,
      } satisfies ImageInputElementData
    }

    if (isFileInput(field)) {
      component = {
        type: Field.FILE as any,
        inputType: Field.FILE as any,
        label: '',
        accept: undefined,
        value: undefined,
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
        label: "",
        value: "",
        inputType: Field.RICHTEXT,
      } satisfies RichTextElementData
    }

    component.index = this._elements.length
    return component as FormElementData & { index: number }
  }

  add(fieldName: keyof typeof Field) {
    this._elements.push(this.initialiseElementData(fieldName))
    this.emit('add', this._elements[this._elements.length - 1])
    return this;
  }

  on(event: 'add' | 'delete' | 'update', callback: Function) {
    this._onAdd[event].push(callback)
  }

  private emit(event: 'add' | 'delete' | 'update', data: FormElementData) {
    for (const callback of this._onAdd[event]) {
      callback(data)
    }
  }

  node(data: FormElementData) {
    return h(FieldComponent, {
      data: data,
      edit: edit,
      onDelete: (idx: number) => {
        this.delete(idx)
      }
    })
  }

  render() {
    this._elements.map(el => {
      if (this.isRendered(el)) return
      const anchor = document.createElement('div')
      anchor.dataset.identity = el.index.toString()
      anchor.addEventListener("dragenter", e => {
        latestEnter.value = anchor
      })
      anchor.addEventListener("dragstart", e => {
        movingElement.value = anchor
      })
      const node = this.node(el)
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
    const element = this.node(data)
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
    this.emit('delete', this._elements[index])
    this._elements = this._elements.filter(el => el.index !== index)
    this.renderedElements = this.renderedElements.filter(el => el !== index)
    this.render()
    return this;
  }

  move(id: number, newIndex: number) {
    const element = this._elements[id]
    this._elements.splice(id, 1)
    this._elements.splice(newIndex, 0, element)
    this._elements = this._elements.map((el, index) => ({...el, index}))
    this.renderedElements = []
    this.target.innerHTML = ''
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

function repositionElement(elements: Elements, event: DragEvent) {
  if (!latestEnter.value) return console.log("No element to reposition")
  if (latestEnter.value === movingElement.value) return

  const movingIndex = Number(movingElement.value?.dataset.identity)
  const newIndex = Number(latestEnter.value?.dataset.identity)
  elements.move(movingIndex, newIndex)
}

const emits = defineEmits<{
  deleteField: [canvasIndex: number, field: FormElementData],
  addField: [canvasIndex: number, field: FormElementData],
  updateField: [canvasIndex: number, field: FormElementData],
  deleteCanvas: [number]
}>()

onMounted(() => {
  const elements = new Elements(container.value!)
  dropzone.value?.addEventListener('drop', (e) => {
    e.preventDefault()
    dropzone.value?.classList.remove('active')
    if (!props.draggedElement?.value) return repositionElement(elements, e)

    elements.add(props.draggedElement.value).render()
    props.draggedElement.value = undefined
  })

  dropzone.value?.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropzone.value?.classList.add('active')
  })

  dropzone.value?.addEventListener('dragleave', (e) => {
    e.preventDefault()
    dropzone.value?.classList.remove('active')
  })

  elements.on('add', (elData: FormElementData) => {
    emits('addField', props.index, elData)
  })

  elements.on('delete', (elData: FormElementData) => {
    emits('deleteField', props.index, elData)
  })

  elements.on('update', (elDatas: Array<FormElementData>) => {
    for (const elData of elDatas) {
      console.log(elData)
      emits('updateField', props.index, elData)
    }
  })
})
</script>
<template>
  <div class="canvas-container">
    <div class="canvas-head">
      <Transition mode="out-in">
        <div class="icon edit" v-if="!edit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" @click="edit = true">
            <path
              d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z">
            </path>
          </svg>
        </div>
        <div class="icon edit" v-else>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" @click="edit = false">
            <path
              d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z">
            </path>
          </svg>
        </div>
      </Transition>
      <div class="icon delete">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
             @click="emits('deleteCanvas', index)">
          <path
            d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z">
          </path>
        </svg>
      </div>
    </div>
    <form class="canvas-form" ref="dropzone" id="dropzone" @submit.prevent>
      <div ref="container"></div>
    </form>
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

#dropzone {
  background-color: white;
  height: fit-content;
  min-height: 5rem;
  border-radius: 0.2rem;
  position: relative;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
}

#dropzone.active {
  border: 2px dashed #333;
}

#dropzone >div{
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.canvas-container {
  width: 100%;
  margin: auto;
  max-width: 800px;
}

.canvas-head {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #323232;
  width: fit-content;
  padding: 2px;
  border-radius: 0.15rem;
  margin-bottom: 0.4rem;
  margin-top: 0.5rem;
  gap: 8px;
}

.icon {
  padding: 4px;
  cursor: pointer;
  border-radius: 0.125rem;
  display: grid;
  place-items: center;
}

.icon:hover{
  background-color: #464545;
}

.icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.icon svg:hover {
  background-color: #464545;
}

.icon:hover.delete svg {
  color: red;
}

.icon:hover.edit svg {
  color: #00a0e4;
}
</style>
