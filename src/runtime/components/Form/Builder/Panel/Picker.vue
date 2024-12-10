<template>
  <div class="panel-item" draggable="true">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <div class="text">
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="description">
        <slot name="description"></slot>
      </div>
    </div>
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

ul{
  list-style: none;
}

a{
  text-decoration: none;
}

.icon {
  width: 35px;
  height: 35px;
  background-color: #2b2a2a;
  display: grid;
  place-items: center;
  border-radius: 4px;
  margin: auto;
}

.text {
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  width: 250px;
}

.title {
  font-weight: 500;
}

.description {
  font-size: 0.8rem;
  color: #737373;
  margin-top: -2px;

  width: 100%;
  overflow: hidden;
}

.panel-item {
  display: flex;
  cursor: pointer;
  background-color: #2b2a2a;
  border-radius: 0.375rem;
  padding: 0.375rem;
}

.panel-item:hover{
  background-color: #262626;
}
</style>
