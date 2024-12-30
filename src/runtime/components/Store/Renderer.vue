<script setup lang="ts">
import { type PropType, computed, inject, type Ref } from "vue";
import type { Item, Store } from "../../types";
import { disabledKey } from "../../utils/symbols";

const props = defineProps({
  data: {
    type: Object as PropType<Store>,
    default: {} as Store,
    required: true,
  },
});

const emits = defineEmits<{
  submit: [];
  price: [number];
  back: [];
}>();

const disabled = inject<Ref<boolean>>(disabledKey);
const items = computed(() => {
  if (disabled?.value) {
    return props.data?.filter((item) => item.carted);
  }
  return props.data;
});

function removePrice(item: Item) {
  if (!item.qtty || item.qtty < 0) item.qtty = 1;
  emits("price", -((Math.abs(item.price) || 0) * item.qtty));
}

function addPrice(item: Item) {
  if (!item.qtty || item.qtty < 0) item.qtty = 1;
  emits("price", (Math.abs(item.price) || 0) * item.qtty);
}

function changeQtty(qtty: number, item: Item) {
  item.qtty = Math.abs(item.qtty);
  if (!item.qtty || item.qtty < 0) item.qtty = 1;

  if (qtty > item.qtty) {
    item.qtty = qtty;
    emits("price", item.price)
  } else {
    item.qtty = qtty;
    emits("price", -item.price)
  }
}
</script>

<template>
  <div class="store-container">
    <div class="store-renderer">
      <StoreCard
        v-for="item in items"
        :key="item.index"
        :item="item"
        @cart="addPrice(item)"
        :edit="false"
        @uncart="removePrice(item)"
        @qtty="changeQtty"
      />
    </div>
    <div class="store-footer" v-if="!disabled">
      <button type="button" @click="emits('back')" class="store-back-button">
        Back
      </button>
      <button class="store-submit-button" @click="emits('submit')">Done</button>
    </div>
  </div>
</template>

<style scoped>
.store-container {
  width: 100%;
  margin: auto;
  max-width: 800px;
}

.store-renderer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.store-footer {
  padding: 0 1rem;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  margin: auto;
}

.store-submit-button {
  padding: 0.5rem 1rem;
  background-color: #047857;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
  border: none;
  cursor: pointer;
}

.store-submit-button:hover {
  background-color: #065f4c;
}

.store-back-button {
  padding: 0.5rem 1rem;
  background-color: #dfdfdf;
  color: #4e4e4e;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
  border: none;
  cursor: pointer;
}

.store-back-button:hover {
  background-color: #e5e5e5;
}
</style>
