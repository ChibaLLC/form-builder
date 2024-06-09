<script setup lang="ts">
import { type FormStoreData, type Forms, type Stores, type FormElementData } from '~/typings';
const props = defineProps({
    data: {
        type: Object as PropType<FormStoreData>,
        required: true
    }
})
const forms = ref<Forms>({})
const stores = ref<Stores>({})

onMounted(() => {
    const form = JSON.parse(localStorage.getItem('form') || '{}') as FormStoreData
    forms.value = form.forms
    stores.value = form.stores

    console.log(forms.value, stores.value)
})

function formSubmit(formIndex: number) {

}

function storeSubmit(storeIndex: number) {

}

</script>
<template>
    <ClientOnly>
        <div v-for="form of Object.entries(forms || {})">
            <FormRenderer :data="form[1]" @submit="formSubmit(+form[0])" />
        </div>
        <div v-for="store of Object.entries(stores || {})">
            <StoreRenderer :data="store[1]" @submit="storeSubmit(+store[0])" />
        </div>
    </ClientOnly>
</template>
<style scoped lang="scss"></style>