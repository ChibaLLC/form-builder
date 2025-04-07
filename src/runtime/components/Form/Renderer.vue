<script setup lang="ts">
import { inject, type Ref, type Reactive } from "vue";
import { disabledKey } from "../../utils/symbols";
import type { _ElementData, FormElementData } from "../../types";
import { isNumberField } from "../../utils/functions";

const emits = defineEmits<{
  submit: [];
  back: [];
}>();

const disabled = inject<Ref<boolean>>(disabledKey);
const props = defineProps<{
  data: Reactive<FormElementData[]>;
  active?: { pageIndex: string; data: FormElementData } | undefined;
  index: string;
}>();

function trim(val: any) {
  if (typeof val !== "string") {
    return val;
  }

  return val.toLowerCase().trim();
}

function number(val: any) {
  if (!val) return 0;
  const num = Number(val);
  if (Number.isNaN(num)) {
    try {
      return parseInt(val);
    } catch (e) {
      console.error(e);
      return 0;
    }
  } else {
    return num;
  }
}

function dependancyFulfilled<T extends _ElementData>(el: T) {
  if (!el.dependsOn) return true;
  let val;
  for (const field of props.data) {
    if (field.label === el.dependsOn.label) {
      val = field;
    }
  }
  if (!val) {
    console.warn("No deps: WTF??");
    return true;
  }

  if (isNumberField(val)) {
    switch (el.dependsOn?.condition) {
      default:
        console.error("WTF???");
        return true;
      case "eq":
        return number(val.value) === number(el.dependsOn?.value);
      case "gt":
        return number(val.value) >= number(el.dependsOn?.value);
      case "lt":
        return number(val.value) <= number(el.dependsOn?.value);
    }
  }
  switch (el.dependsOn?.condition) {
    default:
      console.error("WTF???");
      return true;
    case "eq":
      return trim(val.value) === trim(el.dependsOn?.value);
    case "gt":
      return trim(val.value) >= trim(el.dependsOn?.value);
    case "lt":
      return trim(val.value) <= trim(el.dependsOn?.value);
  }
}
</script>
<template>
  <Title>Form</Title>
  <div class="form-container">
    <form class="form-renderer" @submit.prevent="emits('submit')">
      <template v-for="el in data" :key="el.index">
        <FormElementsRenderer
          v-if="dependancyFulfilled(el)"
          :data="el"
          :active="
            index === active?.pageIndex && active.data.index === el.index
          "
        />
      </template>
      <div class="form-footer" v-if="!disabled">
        <button type="button" @click="emits('back')" class="form-back-button">
          Back
        </button>
        <button type="submit" class="form-submit-button">Submit</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.form-container {
  width: 100%;
  margin: auto;
  max-width: 800px;

  transition: all 0.25s;
}

.form-renderer {
  background-color: #fff;
  height: fit-content;
  border-radius: 0.5rem;
  position: relative;
}

.form-footer {
  padding: 0 1rem;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  margin: auto;
}

.form-submit-button {
  padding: 0.5rem 1rem;
  background-color: #047857;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
  border: none;
  cursor: pointer;
}

.form-submit-button:hover {
  background-color: #065f4c;
}

.form-back-button {
  padding: 0.5rem 1rem;
  background-color: #dfdfdf;
  color: #4e4e4e;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
  border: none;
  cursor: pointer;
}

.form-back-button:hover {
  background-color: #e5e5e5;
}
</style>
