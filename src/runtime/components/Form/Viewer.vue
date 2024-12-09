<script setup lang="ts">
import { ref, type PropType, watch, toRef, provide, type Ref } from 'vue'
import type { Form, FormElementData, Input, Item, Pages, Stores } from '../../types'
import { disabledKey, draggedElementKey, editKey } from '../../utils/symbols';

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
const pages = toRef(() => props.data.pages || {})
const stores = toRef(() => props.data.stores || {})
const _pages = Object.entries(pages.value)
const _stores = Object.entries(stores.value)
const flowDirection = ref('forward')
const currentFormIndex = ref(0)
const currentStoreIndex = ref(0)

function isDoneForms(currentIndex: number) {
  return currentIndex >= _pages.length - 1
}

function isDoneStores(currentIndex: number) {
  return currentIndex >= _stores.length - 1
}

function formSubmit(formIndex: number, fields: FormElementData[]) {
  currentFormIndex.value = formIndex + 1

  emits('complete', fields)
  flowDirection.value = 'forward'
  if (isDoneForms(formIndex) && _stores.length === 0) done()
}

function storeSubmit(storeIndex: number, items: Item[]) {
  currentStoreIndex.value = storeIndex + 1

  emits('complete', items)
  flowDirection.value = 'forward'
  if (isDoneStores(storeIndex)) done()
}

function done() {
  disabled.value = true
  emits('submit', { pages: Object.fromEntries(_pages), stores: Object.fromEntries(_stores) })
}

function rerender() {
  currentFormIndex.value = 0
  currentStoreIndex.value = 0
}

function goBack() {
  disabled.value = false;
  flowDirection.value = 'backward'
  if (currentStoreIndex.value > 0) {
    currentStoreIndex.value -= 1
  } else if(currentFormIndex.value > 0) {
    currentFormIndex.value -= 1
  } else {
    emits("back")
    rerender()
  }
}

watch(() => props.reRender, rerender)
const disabled = ref(false)
provide<Ref<boolean>>(editKey, ref(false))
provide<Ref<boolean>>(disabledKey, disabled)
provide<Ref<Input | undefined>>(draggedElementKey, ref(undefined))
</script>
<template>
  <div class="content__holder">
    <TransitionGroup tag="div" :name="flowDirection === 'forward' ? 'slide_out' : 'slide_in'">
      <div v-for="[index, page] of _pages" v-if="currentFormIndex < _pages.length">
        <FormRenderer v-if="currentFormIndex === +index" @submit="formSubmit(+index, page)" @back="goBack"
          :data="page" />
      </div>
      <div v-for="[index, store] of _stores"
        v-if="_stores.length && currentFormIndex >= _pages.length && currentStoreIndex < _stores.length">
        <StoreRenderer v-if="currentStoreIndex === +index" :data="store" @submit="storeSubmit(+index, store)"
          @price="emits('price', $event)" @back="goBack" />
      </div>
      <div class="processing" v-if="currentFormIndex >= _pages.length && currentStoreIndex >= _stores.length">
        <div class="loading-spinner" v-if="showSpinner"></div>
        <div v-else>
          <div v-for="[_, page] in _pages">
            <FormRenderer :data="page" />
          </div>
          <div v-for="[_, store] of _stores">
            <StoreRenderer :data="store" />
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
