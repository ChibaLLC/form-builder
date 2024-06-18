<script setup lang="ts">
import {type CSSProperties, type PropType} from "vue";

defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: true
  }
})
</script>

<template>
  <div class="properties" :style="styles">
    <h3 class="font-bold">Properties</h3>
  </div>
</template>

<style scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

ul,
ol{
  list-style: none;
}

a{
  text-decoration: none;
}

.properties {
  width: 100%;
  background-color: #262626;
  padding: 1rem;
  color: white;
}

.font-bold {
  font-weight: bold;
}
</style>
