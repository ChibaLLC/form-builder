<template>
    <ul class="foot-menu">
        <slot/>
    </ul>
</template>
<style scoped lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

ul{
  list-style: none;
}

a{
  text-decoration: none;
}

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
