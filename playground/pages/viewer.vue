<script setup lang="ts">
const formData = ref<FormData | undefined>(undefined);
const price = ref(0);

function addPrice(val: any) {
  console.log("Price added", val);
  price.value += val;
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
  <div
    style="
      max-width: 800px;
      padding: 1rem;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    "
  >
    <button @click="rerender = !rerender" style="padding: 0.5rem 1rem">
      Rerender
    </button>
    <p>
      Tital price <span style="color: rebeccapurple">{{ price }}</span>
    </p>
  </div>
</template>

<style scoped></style>
