<template>
  <div class="flex cursor-pointer hover:bg-[#2b2a2a] rounded-md p-1.5" draggable="true">
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

<style scoped lang="scss">
.icon {
  width: 32px;
  height: 32px;
  background-color: #393939;
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
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>