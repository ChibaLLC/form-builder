<script setup lang="ts">
import { type Item, type FormElementData } from '~/typings';
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})
const formFilled = ref(false)
const elements = ref<Array<FormElementData>>()
const stores = ref<Map<number, Array<Item>>>(new Map<number, Array<Item>>())

onMounted(() => {
    const form = JSON.parse(localStorage.getItem('form') || '{}')
    elements.value = form.elements
    stores.value = new Map(form.stores)

    console.log(elements.value, stores.value)
})

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
        return h('form', elements.value?.map((element: FormElementData) => h(FormElementRenderer, { data: element, edit: false, onInput: this.onInput })))
    }
})
</script>
<template>
    <ClientOnly>
        <FormRenderer @submit="formSubmit" v-if="!formFilled" />
        <StoreRenderer :stores="stores" v-else />
    </ClientOnly>
</template>
<style scoped lang="scss"></style>