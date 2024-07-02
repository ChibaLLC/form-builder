<script setup lang="ts">
import {type PropType, computed} from 'vue'
import type {Store} from '../../types'

const props = defineProps({
  data: {
    type: Object as PropType<Store>,
    default: {} as Store,
    required: true
  },
})

const emits = defineEmits<{
  submit: [],
  price: [any]
}>()
</script>

<template>
  <div class="store-container">
    <div class="store-renderer">
      <StoreCard v-for="item in data" :key="item.index" :item="item"
                 @cart="emits('price', Math.abs(item.price) || 0)"
                 @uncart="emits('price', -Math.abs(item.price) || 0)"/>
    </div>
    <div class="store-footer">
      <button class="store-submit-button" @click="emits('submit')">
        Done
      </button>
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
  padding: 1rem;
  max-width: 800px;
  display: flex;
  justify-content: flex-end;
  margin: auto;
}

.store-submit-button {
  padding: 0.5rem 1rem;
  background-color: #047857;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.25s;
  border: none;
  cursor: pointer
}

.store-submit-button:hover {
  background-color: #065f4c;
}
</style>
