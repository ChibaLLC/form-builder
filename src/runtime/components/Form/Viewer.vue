<script setup lang="ts">
import { ref, type PropType, watch } from 'vue'
import type { Form, FormElementData, Item, Pages, Stores } from '../../types'

const emits = defineEmits<{
  submit: [Form],
  complete: [FormElementData[] | Item[]],
  price: [number],
  back: []
}>()
const props = defineProps({
  data: {
    type: Object as PropType<Form>,
    default: {
      forms: {} as Pages,
      stores: {} as Stores
    },
    required: true
  },
  reRender: {
    type: Boolean,
    default: false,
    required: false
  },
  showSpinner: {
    type: Boolean,
    default: false,
    required: false
  }
})
const pages = Object.entries(props.data.pages || {})
const stores = Object.entries(props.data.stores || {})
const flowDirection = ref('forward')
const currentFormIndex = ref(0)
const currentStoreIndex = ref(0)

function isDoneForms(currentIndex: number) {
  return currentIndex >= pages.length - 1
}

function isDoneStores(currentIndex: number) {
  return currentIndex >= stores.length - 1
}

function formSubmit(formIndex: number, fields: FormElementData[]) {
  currentFormIndex.value = formIndex + 1

  emits('complete', fields)
  flowDirection.value = 'forward'
  if (isDoneForms(formIndex) && stores.length === 0) done()
}

function storeSubmit(storeIndex: number, items: Item[]) {
  currentStoreIndex.value = storeIndex + 1

  emits('complete', items)
  flowDirection.value = 'forward'
  if (isDoneStores(storeIndex)) done()
}

function done() {
  emits('submit', { pages: Object.fromEntries(pages), stores: Object.fromEntries(stores) })
}

function rerender() {
  currentFormIndex.value = 0
  currentStoreIndex.value = 0
}

function goBack() {
  flowDirection.value = 'backward'
  if (currentStoreIndex.value > 0) {
    currentStoreIndex.value -= 1
  } else {
    if (currentFormIndex.value === 0) return emits("back")
    currentFormIndex.value -= 1
  }
}

watch(() => props.reRender, rerender)
</script>
<template>
  <div class="content__holder">
    <TransitionGroup tag="div" :name="flowDirection === 'forward' ? 'slide_out' : 'slide_in'">
      <div v-for="[index, page] of pages" v-if="currentFormIndex < pages.length">
        <FormRenderer v-if="currentFormIndex === +index" :data="page" @submit="formSubmit(+index, page)"
          @back="goBack" />
      </div>
      <div v-for="[index, store] of stores"
        v-if="stores.length && currentFormIndex >= pages.length && currentStoreIndex < stores.length">
        <StoreRenderer v-if="currentStoreIndex === +index" :data="store" @submit="storeSubmit(+index, store)"
          @price="emits('price', $event)" @back="goBack" />
      </div>
      <div class="processing" v-if="currentFormIndex >= pages.length && currentStoreIndex >= stores.length">
        <div class="loading-spinner" v-if="showSpinner"></div>
        <div v-else>
          <div v-for="[_, page] in pages">
            <FormRenderer :data="page" :disabled="true" />
          </div>
          <div v-for="[_, store] of stores">
            <StoreRenderer :data="store" :disabled="true" />
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
<style scoped>
.content__holder {
  min-height: 10rem;
  height: fit-content;
  display: grid;
  width: 100%;
  place-items: center;
}

.content__holder>div {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.loading-spinner {
  animation-play-state: running;
  opacity: 1;
  position: relative;
  transition: opacity linear 0.1s;
  width: 50px;
  height: 50px;
  margin: auto;
}

@keyframes spinner {
  0% {
    transform: translate3d(-50%, -50%, 0) rotate(0deg);
  }

  100% {
    transform: translate3d(-50%, -50%, 0) rotate(360deg);
  }
}

.loading-spinner.-paused {
  animation-play-state: paused;
  opacity: 0.2;
  transition: opacity linear 0.1s;
}

.loading-spinner::before {
  animation: 1.5s linear infinite spinner;
  animation-play-state: inherit;
  border: solid 3px #dedede;
  border-bottom-color: #575757;
  border-radius: 50%;
  content: "";
  left: 50%;
  opacity: inherit;
  position: absolute;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 50px;
  height: 50px;
  will-change: transform;
}


.slide_out-enter-active {
  width: 0;
  height: 0;
}

.slide_out-enter-from {
  opacity: 0;
}

.slide_out-enter-to {
  transition: opacity 0.3s;
  opacity: 0;
}

.slide_out-leave-active {
  transition: opacity 0.3s;
  opacity: 0.5;
}

.slide_out-leave-to {
  transition: transform 0.3s;
  transform: translateY(-100%);
  opacity: 0.5;
}

.slide_in-enter-active {
  width: 0;
  height: 0;
}

.slide_in-enter-from {
  opacity: 0;
}

.slide_in-enter-to {
  transition: opacity 0.3s;
  opacity: 0;
}

.slide_in-leave-active {
  transition: opacity 0.3s;
  opacity: 0.5;
}

.slide_in-leave-to {
  transition: transform 0.3s;
  transform: translateY(100%);
  opacity: 0.5;
}
</style>
