<script setup lang="ts">
import {Field} from '~/typings';

const emit = defineEmits(['dragstart'])
</script>

<template>
  <ul ref="ul">
    <li>
      <Picker @dragstart="emit('dragstart', Field.PASSWORD)">
        <template #icon>
          <Icon name="lock"/>
        </template>
        <template #title>
          <h3>Password</h3>
        </template>
        <template #description>
          <p>A field for inputting a secret</p>
        </template>
      </Picker>
    </li>
    <li>
      <Picker @dragstart="emit('dragstart', Field.EMAIL)">
        <template #icon>
          <Icon name="mail"/>
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
          <Icon name="text"/>
        </template>
        <template #title>
          <h3>Text</h3>
        </template>
        <template #description>
          <p>A field for inputting text</p>
        </template>
      </Picker>
    </li>
  </ul>
</template>

<style scoped></style>