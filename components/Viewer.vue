<script setup lang="ts">
import { type Item, type FormElementData } from '~/typings';
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const form = JSON.parse(localStorage.getItem('form') || '{}')
const elements = ref<Array<FormElementData>>(form.elements || [])
const stores = reactive<Record<number, Array<Item>>>(form.stores || new Map<number, Array<Item>>())

const formFilled = ref(false)

function formSubmit(data: any) {
    formFilled.value = true
    console.log(data)
}

const FormElementRenderer = resolveComponent("ElementsRenderer")
const FormRenderer = defineComponent({
    setup() {
        function onInput(index: number, value: any) {
            // @ts-ignore
            elements.value[index].value = value
        }
        return { onInput }
    },
    render() {
        return h('form', elements.value.map((element: FormElementData) => h(FormElementRenderer, { data: element, edit: false, onInput: this.onInput })))
    }
})
</script>
<template>
    <FormRenderer :elements="elements" @submit="formSubmit" v-if="!formFilled" />
    <StoreRenderer :stores="stores" v-else />
</template>
<style scoped lang="scss"></style>