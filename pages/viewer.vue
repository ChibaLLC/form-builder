<script setup lang="ts">
import { type FormStoreData } from '~/typings';

const data = ref<FormStoreData>({} as FormStoreData)

onMounted(() => {
    data.value = JSON.parse(localStorage.getItem('form') || '{}')
})
</script>
<template>
    <ClientOnly>
        <Viewer :data="data" @submit="console.log"/>
    </ClientOnly>
</template>