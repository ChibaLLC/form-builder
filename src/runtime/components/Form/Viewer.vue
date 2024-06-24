<script setup lang="ts">
import {ref, computed, type PropType} from 'vue'
import type {FormStoreData, FormElementData, Item, Forms, Stores} from '../../types'

const emits = defineEmits<{
  submit: [FormStoreData],
  complete: [FormElementData[] | Item[]]
}>()
const props = defineProps({
  data: {
    type: Object as PropType<FormStoreData>,
    default: {
      forms: {} as Forms,
      stores: {} as Stores
    },
    required: true
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
</script>
<template>
  <div v-for="form in Object.entries(forms || {})" v-if="currentFormIndex < formLength">
    <FormRenderer :data="form[1]" @submit="formSubmit(+form[0], form[1])" v-if="currentFormIndex === +form[0]"/>
  </div>
  <div v-for="store of Object.entries(stores || {})" v-if="storeLength > 0 && currentFormIndex >= formLength">
    <StoreRenderer :data="store[1]" @submit="storeSubmit(+store[0], store[1])"
                   v-if="currentStoreIndex === +store[0]"/>
  </div>
</template>
<style scoped></style>
