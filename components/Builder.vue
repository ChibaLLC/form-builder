<script setup lang="ts">
import { render } from 'vue';
import { Field, type FormElementData } from '~/typings';

const canvasContainer = ref<HTMLElement | null>(null)
const draggedElement = ref<Field | undefined>(undefined)
const elements = ref<Array<FormElementData>>([])

function setDragged(value: Field) {
  draggedElement.value = value
}

const Canvas = resolveComponent('Canvas')
const canvases = ref<Array<any>>([])

function addCanvas() {
  if (!canvasContainer.value) return console.error('Canvas container not found')

  const div = document.createElement("div")
  div.dataset.id = String(canvases.value.length)
  const node = h(Canvas, {
    draggedElement: draggedElement,
    elements: elements,
    index: canvases.value.length,
    onDelete: (index: number) => {
      const newCanvases = canvases.value.filter((_, i) => i !== index)
      canvases.value = newCanvases
      canvasContainer.value?.querySelector(`[data-id="${index}"]`)?.remove()
    }
  })
  render(node, div)
  canvasContainer.value.appendChild(div)
}

onMounted(addCanvas)
</script>
<template>
  <div class="flex max-w-[100svw] max-h-[100svh]">
    <div class="flex-1">
      <Panel @dragstart="setDragged" />
    </div>
    <div class="flex-auto">
      <div ref="canvasContainer"></div>
      <div class="text-white text-center w-full cursor-pointer" @click="addCanvas">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30px" height="30px"
          class="text-white text-2xl mx-auto absolute -bottom-5 bg-blue-950 left-1/2 -translate-x-1/2 rounded-full p-0.5"
          title="Add Page Break">
          <path
            d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z">
          </path>
        </svg>
      </div>
    </div>
    <div class="flex-1">
      <Properties />
    </div>
  </div>
</template>