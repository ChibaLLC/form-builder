<script setup lang="ts">
// import { FormBuilderInterface } from "@chiballc/form-builder";
import FormBuilderInterface from "@chiballc/form-builder/components/FormBuilderInterface.vue";
import {
  PublishedFormExample,
  PublishedFormRenderer,
  type FormSchema,
} from "@chiballc/form-builder/index";
import type { Store } from "@chiballc/form-builder/types";
import { ref } from "vue";
const form = ref<FormSchema | null>(null);
const stores = ref<Store[]>([]);
const handlePublished = (formSchema: FormSchema, store: Store[]) => {
  form.value = formSchema;
  stores.value = store;
};
const handleSubmit = (data: {
  formData: Record<string, any>;
  selectedProducts: any[];
}) => {
  console.log(data);
};
</script>

<template>
  <FormBuilderInterface v-if="form == null" @submit="handlePublished" />
  <PublishedFormRenderer
    v-if="form"
    :form="form"
    :stores="stores"
    :show-stores="stores.length > 0"
    @submit="handleSubmit"
  />
  <!-- <PublishedFormExample /> -->
</template>

<style scoped></style>
