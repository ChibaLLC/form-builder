<script setup lang="ts">
const formData = ref<any | undefined>(undefined)
async function saveForm(data: FormData) {
    localStorage.setItem('formData', JSON.stringify(data))
    await navigateTo("/viewer")
}

onMounted(() => {
    const data = localStorage.getItem('formData')
    if (data) {
        formData.value = JSON.parse(data)
        console.log('Data found', formData.value)
    } else {
        console.warn('No form data found')
    }
})
</script>
<template>
    <Title>Edit</Title>
    <FormBuilder :starter="formData" @submit="saveForm"/>
</template>