<template>
    <ul class="foot-menu">
        <slot/>
    </ul>
</template>
<style scoped lang="scss">
.foot-menu {
  position: absolute;
  z-index: 100;
  background-color: #FFF;
  border-radius: 5px;
  display: flex;
  bottom: 1rem;
  right: 50%;
  transform: translateX(50%);
  padding: 2px;
}
</style>