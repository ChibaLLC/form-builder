<script setup lang="ts">
const formData = ref<FormData | undefined>(undefined)

function addPrice(val: any) {
  console.log('Price added', val)
}

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
    <FormViewer :data="formData as any" @price="addPrice" style="margin-top: 10rem"/>
  </ClientOnly>
</template>

<style scoped>

</style>
