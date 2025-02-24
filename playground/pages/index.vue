<script setup lang="ts">
async function saveForm(data: any) {
  localStorage.setItem('formData', JSON.stringify(data))
  await navigateTo("/viewer")
}
</script>

<template>
  <Title>Builder</Title>
  <FormBuilder @submit="saveForm" />
</template>

<style scoped>
</style>
