<script setup lang="ts">
import { type CSSProperties, type PropType, type Ref, ref, onMounted, provide, resolveComponent, shallowReactive, watch } from 'vue';
import type { Pages, Form, Stores, Store, Page, Input, FormElementData } from '../../../types'
import { disabledKey, draggedElementKey, editKey } from '../../../utils/symbols';
import { createFormPage } from './Page/_utils';
import { createStorePage } from '../../Store/_utils';

const Page = resolveComponent('FormBuilderPage')
const form = shallowReactive<{ pages: Pages; stores: Stores }>({
  pages: {},
  stores: {}
})


const pages = shallowReactive<ReturnType<typeof createFormPage>[]>([])
function addPage(starter?: Page) {
  pages.push(createFormPage(Page, form.pages, starter))
}

const Store = resolveComponent("Store")
const stores = shallowReactive<ReturnType<typeof createStorePage>[]>([])
function addStore(starter?: Store) {
  stores.push(createStorePage(Store, form.stores, starter))
}

const emits = defineEmits<{
  submit: [Form]
}>()

const props = defineProps({
  styles: {
    type: Object as PropType<Pick<CSSProperties, 'height'>>,
    required: false,
    default: () => ({
      height: "100svh"
    })
  },
  starter: {
    type: Object as PropType<Form>,
    required: false,
    default: () => ({
      pages: {},
      stores: {}
    })
  }
})


const draggedElement = ref<Input | undefined>(undefined)
provide<Ref<boolean>>(editKey, ref(true))
provide<Ref<boolean>>(disabledKey, ref(true))
provide<Ref<Input | undefined>>(draggedElementKey, draggedElement)

function setDragged(value: Input) {
  draggedElement.value = value
}

async function submit() {
  emits('submit', form)
}

const hasPages = Object.values(props.starter.pages || {}).some(form => form.length)
const hasStores = Object.values(props.starter.stores).some(store => store.length)

if (hasPages || hasStores) {
  for (const form in props.starter.pages) {
    addPage(props.starter.pages[form])
  }
  for (const store in props.starter.stores) {
    addStore(props.starter.stores[store])
  }
} else {
  addPage()
}

onMounted(() => {
  if (window.innerWidth < 768) {
    alert("This page is not optimized for mobile devices. Please use a desktop or a tablet to build a form.")
  }
})

const active = ref<FormElementData | undefined>(undefined)
</script>
<template>
  <div class="three" :style="styles">
    <div>
      <FormBuilderPanel @dragstart="setDragged" :styles="styles" />
    </div>
    <div class="builder">
      <div class="canvas-container">
        <div v-for="page of pages">
          <component :is="page" @active="active = $event" />
        </div>
        <div v-for="store of stores">
          <component :is="store" />
        </div>
      </div>
      <div class="canvas-icons-container">
        <div class="canvas-icons">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" title="Add Page Break"
            @click="addPage()" class="canvas-icon">
            <path
              d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z">
            </path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" title="Add a Store Section"
            @click="addStore()" class="canvas-icon">
            <path
              d="M21 13.2422V20H22V22H2V20H3V13.2422C1.79401 12.435 1 11.0602 1 9.5C1 8.67286 1.22443 7.87621 1.63322 7.19746L4.3453 2.5C4.52393 2.1906 4.85406 2 5.21132 2H18.7887C19.1459 2 19.4761 2.1906 19.6547 2.5L22.3575 7.18172C22.7756 7.87621 23 8.67286 23 9.5C23 11.0602 22.206 12.435 21 13.2422ZM19 13.9725C18.8358 13.9907 18.669 14 18.5 14C17.2409 14 16.0789 13.478 15.25 12.6132C14.4211 13.478 13.2591 14 12 14C10.7409 14 9.5789 13.478 8.75 12.6132C7.9211 13.478 6.75911 14 5.5 14C5.331 14 5.16417 13.9907 5 13.9725V20H19V13.9725ZM5.78865 4L3.35598 8.21321C3.12409 8.59843 3 9.0389 3 9.5C3 10.8807 4.11929 12 5.5 12C6.53096 12 7.44467 11.3703 7.82179 10.4295C8.1574 9.59223 9.3426 9.59223 9.67821 10.4295C10.0553 11.3703 10.969 12 12 12C13.031 12 13.9447 11.3703 14.3218 10.4295C14.6574 9.59223 15.8426 9.59223 16.1782 10.4295C16.5553 11.3703 17.469 12 18.5 12C19.8807 12 21 10.8807 21 9.5C21 9.0389 20.8759 8.59843 20.6347 8.19746L18.2113 4H5.78865Z">
            </path>
          </svg>
        </div>
      </div>
      <div>
        <FormBuilderFooter>
          <FormBuilderFooterItem>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="footer-item"
              title="Save" @click="submit">
              style="width: 28px; height: 28px;">
              <path
                d="M7 19V13H17V19H19V7.82843L16.1716 5H5V19H7ZM4 3H17L21 7V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM9 15V19H15V15H9Z">
              </path>
            </svg>
          </FormBuilderFooterItem>
          <slot name="footer" />
        </FormBuilderFooter>
      </div>
    </div>
    <div>
      <FormBuilderProperties :styles="styles" :data="active" />
    </div>
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

.three {
  display: flex;
  background-color: #191919;
}

.three>div:first-child {
  width: 300px;
  max-width: 20vw;
}

.three>div:nth-child(2) {
  flex: 1;
}

.three>div:last-child {
  width: 300px;
  max-width: 20vw;
}

.builder {
  position: relative;
  width: 100%;
  margin-top: 0;
  padding: 8px 10px 0;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
}

.builder::-webkit-scrollbar {
  width: 5px;
  position: absolute;
}

.builder::-webkit-scrollbar-thumb {
  background-color: #323232;
  border-radius: 10px;
}

.builder::-webkit-scrollbar-track {
  background-color: #191919;
}

.canvas-container,
.canvas-icons-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
}

.canvas-icons {
  all: unset;
  color: white;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(38, 38, 38, 0.4);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-top: 0.25rem;
  padding: 1px;
}

.canvas-icon {
  cursor: pointer;
  color: #262626;
  background-color: white;
  border-radius: 2px;
  width: 28px;
  height: 28px;
  padding: 4px;

  transition: all 100ms ease-in;
}

.canvas-icon:hover {
  background-color: hsla(0, 0%, 15%, 0.8);
  color: white;
}

.footer-item {
  width: 28px;
}
</style>
