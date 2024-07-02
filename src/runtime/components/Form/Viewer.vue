<script setup lang="ts">
import {ref, computed, type PropType, watch} from 'vue'
import type {FormStoreData, FormElementData, Item, Forms, Stores} from '../../types'

const emits = defineEmits<{
  submit: [FormStoreData],
  complete: [FormElementData[] | Item[]],
  price: [number]
}>()
const props = defineProps({
  data: {
    type: Object as PropType<FormStoreData>,
    default: {
      forms: {} as Forms,
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
const forms = ref<Forms>(props.data.forms)
const stores = ref<Stores>(props.data.stores)
const currentFormIndex = ref(0)
const currentStoreIndex = ref(0)
const formLength = computed(() => Object.entries(forms.value || {}).length)
const storeLength = computed(() => Object.entries(stores.value || {}).length)

function isDoneForms(currentIndex: number) {
  return currentIndex >= formLength.value - 1
}

function isDoneStores(currentIndex: number) {
  return currentIndex >= storeLength.value - 1
}

function formSubmit(formIndex: number, fields: FormElementData[]) {
  currentFormIndex.value = formIndex + 1

  emits('complete', fields)
  if (isDoneForms(formIndex) && storeLength.value === 0) done()
}

function storeSubmit(storeIndex: number, items: Item[]) {
  currentStoreIndex.value = storeIndex + 1

  emits('complete', items)
  if (isDoneStores(storeIndex)) done()
}

function done() {
  emits('submit', {forms: forms.value, stores: stores.value})
}

function rerender() {
  currentFormIndex.value = 0
  currentStoreIndex.value = 0
}

function goBack() {
  if (currentStoreIndex.value > 0) {
    currentStoreIndex.value -= 1
  } else {
    if (currentFormIndex.value === 0) return window.history.back()
    currentFormIndex.value -= 1
  }
}

watch(() => props.reRender, rerender)
</script>
<template>
  <div class="content__holder">
    <TransitionGroup name="slide" tag="div">
      <div v-for="form in Object.entries(forms || {})" v-if="currentFormIndex < formLength">
        <FormRenderer :data="form[1]" @submit="formSubmit(+form[0], form[1])" v-if="currentFormIndex === +form[0]"
                      @back="goBack"/>
      </div>
      <div v-for="store of Object.entries(stores || {})"
           v-if="storeLength > 0 && currentFormIndex >= formLength && currentStoreIndex < storeLength">
        <StoreRenderer :data="store[1]" @submit="storeSubmit(+store[0], store[1])" @price="emits('price', $event)"
                       @back="goBack"
                       v-if="currentStoreIndex === +store[0]"/>
      </div>
      <div class="processing" v-if="currentFormIndex >= formLength && currentStoreIndex >= storeLength">
        <div class="loading-spinner" v-if="showSpinner"></div>
        <div v-else>
          <div v-for="form in Object.entries(forms || {})">
            <FormRenderer :data="form[1]" :disabled="true"/>
          </div>
          <div v-for="store of Object.entries(stores || {})">
            <StoreRenderer :data="store[1]" :disabled="true"/>
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
  max-height: 100vh;
  display: grid;
  width: 100%;
  place-items: center;
}

.content__holder > div {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.loading-spinner {
  animation-play-state: running;
  opacity: 1;
  position: relative;
  transition: opacity linear 0.1s;
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
  height: 40px;
  left: 50%;
  opacity: inherit;
  position: absolute;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 40px;
  will-change: transform;
}


.slide-enter-active{
  width: 0;
  height: 0;
}

.slide-enter-from {
  opacity: 0;
}

.slide-enter-to {
  transition: opacity 0.3s;
  opacity: 0;
}

.slide-leave-active{
  transition: opacity 0.3s;
  opacity: 0.5;
}

.slide-leave-to {
  transition: transform 0.3s;
  transform: translateY(-100%);
  opacity: 0.5;
}
</style>
