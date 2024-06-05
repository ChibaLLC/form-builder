<script setup lang="ts">
import { isStatic, type FormStoreData, type Forms, type Stores, type Form } from '~/typings';
const props = defineProps({
    data: {
        type: Object as PropType<FormStoreData>,
        required: true
    }
})
const formFilled = ref(false)
const forms = ref<Forms>({})
const stores = ref<Stores>({})

onMounted(() => {
    const form = JSON.parse(localStorage.getItem('form') || '{}') as FormStoreData
    forms.value = form.forms
    stores.value = form.stores

    console.log(forms.value, stores.value)
})

function formSubmit(data: any) {
    formFilled.value = true
    console.log(data)
}

const FormElementRenderer = resolveComponent("ElementsRenderer")
const FormRenderer = defineComponent({
    setup(props: {
        formIndex: number,
        formData: Form
    }) {
        const onInput = (formIndex: number, fieldIndex: number, value: any) => {
            const field = forms.value?.[formIndex][fieldIndex]
            if (field) {
                if (isStatic(field)) return console.warn("Static field cannot be edited")
                field.value = value
            } else {
                console.warn("Form not found")
            }
        }
        return { onInput, props }
    },
    render() {
        return h("div", this.props.formData.map(data => {
            return h(FormElementRenderer, {
                data: data,
                onInput: this.onInput.bind(null, this.props.formIndex)
            })
        }))
    }
})
</script>
<template>
    <ClientOnly>
        <div v-for="form of Object.entries(forms || {})">
            <FormRenderer @submit="formSubmit" :formData="form[1]" :formIndex="Number(form[0])" />
        </div>
        <div v-for="store of Object.entries(stores || {})">
            <StoreRenderer :storeData="store[1]" :storeIndex="store[0]" />
        </div>
    </ClientOnly>
</template>
<style scoped lang="scss"></style>