<script setup lang="ts">
const formData = ref<FormData | undefined>(undefined)
onMounted(() => {
  const data = localStorage.getItem('formData')
  if (data) {
    formData.value = JSON.parse(data)
  } else {
    console.warn('No form data found')
  }
})
</script>

<template>
  <Title>Viewer</Title>
  <ClientOnly>
    <FormViewer :data="formData"/>
  </ClientOnly>
</template>

<style scoped>

</style>
