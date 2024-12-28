<script setup lang="ts">
const formData = ref<FormData | undefined>(undefined);

function addPrice(val: any) {
  console.log("Price added", val);
}

onMounted(() => {
  const data = localStorage.getItem("formData");
  if (data) {
    formData.value = JSON.parse(data);
  } else {
    console.warn("No form data found");
  }
});

const rerender = ref(false);
</script>

<template>
  <Title>Viewer</Title>
  <ClientOnly>
    <FormViewer
      :data="formData as any"
      @price="addPrice"
      style="margin-top: 10rem"
      @submit="console.log"
      :re-render="rerender"
      @back="console.log('Back')"
    />
  </ClientOnly>
  <button @click="rerender = !rerender">Rerender</button>
</template>

<style scoped></style>
