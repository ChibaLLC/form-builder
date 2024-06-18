<template>
  <li class="footer-list-item">
    <slot/>
  </li>
</template>
<style scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
}

.footer-list-item {
  padding: 5px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.15s;
  border-radius: 4px;
  color: #191919;
}

.footer-list-item:hover {
  background-color: hsla(0, 0%, 15%, 0.8);
  color: white;
}
</style>
