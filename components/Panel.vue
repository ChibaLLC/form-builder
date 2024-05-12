<script setup lang="ts">
import { Field } from '~/typings';

const emit = defineEmits(['dragstart'])
</script>

<template>
  <ul ref="ul">
    <li>
      <Picker @dragstart="emit('dragstart', Field.EMAIL)">
        <template #icon>
          <Icon name="mail" />
        </template>
        <template #title>
          <h3>Email</h3>
        </template>
        <template #description>
          <p>A field for inputting an email</p>
        </template>
      </Picker>
    </li>
    <li>
      <Picker @dragstart="emit('dragstart', Field.TEXT)">
        <template #icon>
          <Icon name="text" />
        </template>
        <template #title>
          <h3>Text</h3>
        </template>
        <template #description>
          <p>A field for inputting text</p>
        </template>
      </Picker>
    </li>
    <li>
      <Picker @dragstart="emit('dragstart', Field.CHECKBOX)">
        <template #icon>
          <Icon name="check" />
        </template>
        <template #title>
          <h3>Checkbox</h3>
        </template>
        <template #description>
          <p>A field for adding a checkbox, can be used to multiple values from a predefined set.</p>
        </template>
      </Picker>
    </li>
    <li>
      <Picker @dragstart="emit('dragstart', Field.SELECT)">
        <template #icon>
          <Icon name="select" />
        </template>
        <template #title>
          <h3>Select</h3>
        </template>
        <template #description>
          <p>A field for adding a dropdown selection.</p>
        </template>
      </Picker>
    </li>
    <li>
      <Picker @dragstart="emit('dragstart', Field.STORE)">
        <template #icon>
          <Icon name="store" />
        </template>
        <template #title>
          <h3>Store</h3>
        </template>
        <template #description>
          <p>A store section</p>
        </template>
      </Picker>
    </li>
  </ul>
</template>

<style scoped></style>