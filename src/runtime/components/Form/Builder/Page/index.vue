<script setup lang="ts">
import { resolveComponent, inject, type Ref, ref, type PropType, onMounted, watch } from 'vue';
import type { Input, Page, FormElementData } from '~/src/runtime/types';
import { editKey, draggedElementKey, activePageIndexKey } from '../../../../utils/symbols';
import { Elements } from '../../../../local';

const edit = inject<Ref<boolean>>(editKey)
const draggedElement = inject<Ref<Input | undefined>>(draggedElementKey)
const activePageIndex = inject<Ref<number | undefined>>(activePageIndexKey)
const dropzone = ref<HTMLElement | null>(null)

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  starter: {
    type: Array as PropType<Page>,
    default: []
  }
})

const emits = defineEmits<{
  focus: [boolean, FormElementData | undefined],
  deleteField: [pageIndex: number, field: FormElementData],
  addField: [pageIndex: number, field: FormElementData],
  updateField: [pageIndex: number, field: FormElementData],
  deleteCanvas: [number],
  active: [FormElementData | undefined]
}>()

const FieldComponent = resolveComponent("FormElementsRenderer")
const elements = new Elements(FieldComponent, props.index)
elements.starter(props.starter)
elements.on('add', (elData: FormElementData) => {
  emits('addField', props.index, elData)
})
elements.on('delete', (elData: FormElementData) => {
  emits('deleteField', props.index, elData)
})
elements.on('update', (elData: FormElementData) => {
  emits('updateField', props.index, elData)
})
watch(elements.active, (val) => {
  emits("active", val)
})

const onDrop = (e: Event) => {
  e.preventDefault()
  dropzone.value?.classList.remove('active')
  if (!draggedElement!.value) return elements.repositionElement()

  elements.add(draggedElement!.value).render()
  draggedElement!.value = undefined
}
const onDragover = (e: Event) => {
  e.preventDefault()
  dropzone.value?.classList.add('active')
}
const onDragleave = (e: Event) => {
  e.preventDefault()
  dropzone.value?.classList.remove('active')
}
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
    <form class="canvas-form" id="dropzone" @submit.prevent @drop="onDrop" @dragover="onDragover"
      @click="activePageIndex = index" @dragleave="onDragleave">
      <div v-if="elements.components.size">
        <component v-for="[index, comp] of elements.components" :is="comp" />
      </div>
      <div v-else style="display: grid; width: 100%; place-items: center; padding: 2rem 0 4rem 0;">
        <!-- drag and drop by icon 54 from <a href="https://thenounproject.com/browse/icons/term/drag-and-drop/" target="_blank" title="drag and drop Icons">Noun Project</a> (CC BY 3.0) -->
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
          viewBox="0 0 24 30" style="enable-background:new 0 0 24 24; width: 100px;" xml:space="preserve">
          <g>
            <g>
              <path
                d="M15.55,23.94H9.5c-0.276,0-0.5-0.224-0.5-0.5c0-1.378,1.122-2.5,2.5-2.5h0.793L8.47,17.117    c-0.295-0.295-0.458-0.687-0.458-1.104c0-0.417,0.163-0.809,0.458-1.104c0.589-0.588,1.617-0.59,2.207,0l0.896,0.896    c0.076-0.171,0.183-0.331,0.323-0.47c0.347-0.347,0.844-0.51,1.322-0.442c0.057-0.296,0.199-0.579,0.428-0.808    c0.437-0.437,1.069-0.561,1.617-0.37c0.073-0.23,0.201-0.447,0.383-0.63c0.608-0.608,1.599-0.608,2.207,0l1.55,1.55    C20.433,15.666,21,17.034,21,18.49C21,21.495,18.555,23.94,15.55,23.94z M10.085,22.94h5.465c2.454,0,4.45-1.996,4.45-4.45    c0-1.188-0.463-2.306-1.303-3.146l-1.55-1.55c-0.219-0.219-0.574-0.219-0.793,0s-0.219,0.574,0,0.793    c0.098,0.098,0.146,0.226,0.146,0.354s-0.049,0.256-0.146,0.354c-0.195,0.195-0.512,0.195-0.707,0l-0.5-0.5    c-0.219-0.219-0.574-0.219-0.793,0c-0.106,0.106-0.164,0.247-0.164,0.396s0.058,0.291,0.164,0.396l0.5,0.5    C14.951,16.184,15,16.312,15,16.44s-0.049,0.256-0.146,0.354c-0.195,0.195-0.512,0.195-0.707,0l-0.75-0.75    c-0.212-0.212-0.581-0.212-0.793,0c-0.106,0.106-0.164,0.247-0.164,0.396s0.058,0.291,0.164,0.396l1.25,1.25    C13.951,18.184,14,18.312,14,18.44s-0.049,0.256-0.146,0.354c-0.195,0.195-0.512,0.195-0.707,0L9.97,15.617    c-0.212-0.212-0.581-0.211-0.793,0c-0.106,0.106-0.165,0.247-0.165,0.396c0,0.149,0.059,0.291,0.165,0.396l4.676,4.676    c0.143,0.143,0.186,0.358,0.108,0.545c-0.077,0.187-0.26,0.309-0.462,0.309h-2C10.848,21.94,10.292,22.358,10.085,22.94z" />
            </g>
            <g>
              <path
                d="M3.5,20.44c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5S7,15.01,7,16.94S5.43,20.44,3.5,20.44z M3.5,14.44    c-1.378,0-2.5,1.122-2.5,2.5s1.122,2.5,2.5,2.5S6,18.318,6,16.94S4.878,14.44,3.5,14.44z" />
            </g>
            <g>
              <path
                d="M21.207,6.856c-0.225,0-0.43-0.153-0.485-0.382c-0.065-0.269,0.1-0.539,0.368-0.604c0.271-0.066,0.528-0.176,0.762-0.327    c0.233-0.148,0.542-0.083,0.691,0.15c0.149,0.232,0.083,0.542-0.15,0.691c-0.328,0.211-0.687,0.365-1.067,0.458    C21.286,6.852,21.246,6.856,21.207,6.856z M19.252,6.669c-0.069,0-0.14-0.015-0.208-0.045c-0.354-0.162-0.678-0.381-0.961-0.652    c-0.2-0.19-0.207-0.507-0.016-0.707s0.508-0.208,0.707-0.016c0.202,0.193,0.433,0.35,0.687,0.465    c0.251,0.115,0.361,0.411,0.247,0.663C19.624,6.561,19.442,6.669,19.252,6.669z M23.336,4.921c-0.054,0-0.109-0.009-0.164-0.027    c-0.261-0.09-0.399-0.375-0.309-0.636C22.954,3.996,23,3.72,23,3.44c0-0.24-0.033-0.477-0.1-0.704    c-0.078-0.265,0.074-0.542,0.339-0.621c0.268-0.075,0.543,0.075,0.621,0.339C23.953,2.774,24,3.106,24,3.441    c0,0.392-0.064,0.777-0.191,1.144C23.737,4.791,23.543,4.921,23.336,4.921z M17.529,4.366c-0.245,0-0.458-0.18-0.495-0.429    C17.011,3.774,17,3.608,17,3.438c0-0.226,0.021-0.447,0.063-0.662c0.052-0.27,0.312-0.447,0.586-0.396    c0.271,0.052,0.448,0.314,0.396,0.586C18.016,3.12,18,3.278,18,3.44c0,0.122,0.008,0.24,0.025,0.355    c0.039,0.273-0.15,0.527-0.424,0.566C17.577,4.364,17.553,4.366,17.529,4.366z M18.536,1.672c-0.14,0-0.279-0.059-0.378-0.173    C17.977,1.291,18,0.975,18.208,0.795c0.295-0.256,0.629-0.459,0.99-0.604c0.256-0.103,0.547,0.022,0.65,0.277    c0.103,0.256-0.021,0.548-0.277,0.65c-0.259,0.104-0.497,0.25-0.709,0.433C18.769,1.632,18.652,1.672,18.536,1.672z M22.24,1.496    c-0.101,0-0.202-0.03-0.29-0.093c-0.227-0.162-0.478-0.284-0.745-0.362c-0.265-0.078-0.417-0.355-0.339-0.621    c0.078-0.265,0.357-0.416,0.621-0.339c0.375,0.11,0.727,0.281,1.045,0.509c0.225,0.161,0.277,0.473,0.116,0.697    C22.549,1.423,22.396,1.496,22.24,1.496z" />
            </g>
            <g>
              <path
                d="M5,14.44c-0.039,0-0.078-0.004-0.118-0.014c-0.269-0.064-0.434-0.334-0.369-0.603c0.078-0.323,0.215-0.673,0.407-1.042    c0.128-0.245,0.43-0.34,0.675-0.212c0.245,0.128,0.339,0.43,0.212,0.675c-0.155,0.296-0.263,0.57-0.322,0.813    C5.431,14.286,5.226,14.44,5,14.44z M6.493,11.862c-0.111,0-0.224-0.037-0.316-0.113c-0.214-0.175-0.245-0.49-0.07-0.704    c0.21-0.256,0.437-0.516,0.678-0.777c0.188-0.203,0.503-0.215,0.707-0.028c0.203,0.188,0.215,0.504,0.028,0.707    c-0.228,0.246-0.441,0.49-0.639,0.732C6.781,11.799,6.638,11.862,6.493,11.862z M8.572,9.696c-0.135,0-0.27-0.054-0.368-0.162    c-0.187-0.203-0.173-0.52,0.03-0.707c0.248-0.228,0.502-0.454,0.762-0.676c0.21-0.178,0.525-0.156,0.705,0.055    c0.18,0.209,0.155,0.525-0.055,0.705C9.396,9.127,9.149,9.345,8.911,9.565C8.814,9.653,8.693,9.696,8.572,9.696z M10.883,7.776    c-0.151,0-0.301-0.068-0.399-0.199c-0.167-0.22-0.123-0.534,0.098-0.7c0.272-0.206,0.546-0.406,0.821-0.601    c0.226-0.16,0.537-0.106,0.697,0.12c0.16,0.225,0.106,0.537-0.12,0.697c-0.266,0.188-0.532,0.382-0.796,0.582    C11.094,7.743,10.988,7.776,10.883,7.776z M13.365,6.086c-0.169,0-0.334-0.086-0.428-0.241c-0.143-0.236-0.067-0.543,0.169-0.687    c0.301-0.183,0.598-0.354,0.889-0.511c0.243-0.132,0.546-0.041,0.678,0.201c0.132,0.243,0.042,0.546-0.201,0.678    c-0.277,0.15-0.56,0.313-0.848,0.487C13.542,6.062,13.453,6.086,13.365,6.086z M16.05,4.749c-0.205,0-0.397-0.127-0.471-0.331    c-0.093-0.26,0.042-0.546,0.302-0.64c0.382-0.137,0.735-0.233,1.049-0.287c0.272-0.043,0.53,0.137,0.577,0.41    c0.046,0.272-0.137,0.53-0.41,0.577c-0.256,0.043-0.552,0.125-0.878,0.242C16.163,4.74,16.106,4.749,16.05,4.749z" />
            </g>
          </g><text x="0" y="39" fill="#000000" font-size="5px" font-weight="bold"
            font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">Created by icon 54</text><text
            x="0" y="44" fill="#000000" font-size="5px" font-weight="bold"
            font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif">from the Noun Project</text>
        </svg>
        <h1 style="width: fit-content; font-size: large;">Drag and drop elements here</h1>
        <p>Drag an item from the left panel and drop it here</p>
      </div>
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
ol {
  list-style: none;
}

a {
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

#dropzone>div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.canvas-container {
  width: 100%;
  margin: auto;
  max-width: 800px;
  position: relative;
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

.icon:hover {
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
