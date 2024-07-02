<script setup lang="ts">
import {type PropType, computed} from 'vue'
import type {Store} from '../../types'

const props = defineProps({
  data: {
    type: Object as PropType<Store>,
    default: {} as Store,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false
  }
})

const emits = defineEmits<{
  submit: [],
  price: [any],
  back: []
}>()

const _items = computed(() => {
  if (props.disabled) {
    return props.data?.filter(item => item.carted)
  }
  return props.data
})
</script>

<template>
  <div class="store-container">
    <div class="store-renderer">
      <StoreCard v-for="item in _items" :key="item.index" :item="item"
                 @cart="emits('price', Math.abs(item.price) || 0)"
                 :edit="false"
                 @uncart="emits('price', -Math.abs(item.price) || 0)"/>
    </div>
    <div class="store-footer">
      <button type="button" @click="emits('back')" class="store-back-button" v-if="!disabled">Back</button>
      <button class="store-submit-button" @click="emits('submit')" v-if="!disabled">
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
  cursor: pointer
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
