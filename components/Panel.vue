<script setup lang="ts">
import {Field} from '~/typings';
import type {CSSProperties} from "vue";

const emit = defineEmits(['dragstart'])
const displayFields = ref(true)

defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: true
  }
})
</script>

<template>
  <div class="panel" :style="styles">
    <div class="search-box">
      <Icon name="search" class="search-icon" :styles='{width: "20px", height: "20px"}'/>
      <input placeholder="Search Elements" class="search"/>
    </div>
    <ul class="w-full overflow-hidden flex flex-col gap-2" v-if="displayFields">
      <li>
        <PickerElement @dragstart="emit('dragstart', Field.EMAIL)">
          <template #icon>
            <Icon name="mail" :styles='{width: "15px", height: "15px"}'/>
          </template>
          <template #title>
            <h3>Email</h3>
          </template>
          <template #description>
            <p>A field for inputting an email</p>
          </template>
        </PickerElement>
      </li>
      <li>
        <PickerElement @dragstart="emit('dragstart', Field.TEXT)">
          <template #icon>
            <Icon name="text" :styles='{width: "15px", height: "15px"}'/>
          </template>
          <template #title>
            <h3>Text</h3>
          </template>
          <template #description>
            <p>A field for inputting text</p>
          </template>
        </PickerElement>
      </li>
      <li>
        <PickerElement @dragstart="emit('dragstart', Field.CHECKBOX)">
          <template #icon>
            <Icon name="check" :styles='{width: "15px", height: "15px"}'/>
          </template>
          <template #title>
            <h3>Checkbox</h3>
          </template>
          <template #description>
            <p>A field for adding a checkbox</p>
          </template>
        </PickerElement>
      </li>
      <li>
        <PickerElement @dragstart="emit('dragstart', Field.SELECT)">
          <template #icon>
            <Icon name="select" :styles='{width: "15px", height: "15px"}'/>
          </template>
          <template #title>
            <h3>Select</h3>
          </template>
          <template #description>
            <p>A field for adding a dropdown.</p>
          </template>
        </PickerElement>
      </li>
    </ul>
    <ul class="w-full overflow-hidden flex flex-col gap-2" v-else>

    </ul>
  </div>
</template>

<style scoped lang="scss">
.panel {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .search-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .search-icon {
      position: absolute;
      color: #737373;
      margin-left: 0.3rem;
    }

    .search {
      width: 100%;
      padding: 0.5rem 0 0.5rem 1.8rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      background-color: #323232;

      &::placeholder {
        color: #737373;
      }

      &:focus {
        outline: none;
      }
    }
  }
}
</style>