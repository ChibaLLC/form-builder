<script setup lang="ts">
import { ref, onMounted, type PropType, computed, type Ref, inject } from 'vue'
import type { Item } from '../../types'
import { editKey } from '../Form/_utils';

const liked = ref(false);
let images: NodeListOf<HTMLImageElement> | null = null;
const mainImage = ref<HTMLImageElement | null>(null);
let currentIndex = 0;

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  }
})
const carted = computed({
  get: () => props.item.carted || false,
  set: (value: boolean) => props.item.carted = value
});

const emits = defineEmits<{
  cart: [],
  uncart: [],
  delete: [number]
}>()

const edit = inject<Ref<boolean>>(editKey)

function like() {
  if (edit?.value) return;
  liked.value = true
  props.item.liked = true
}

function cart() {
  if (edit?.value) return;
  carted.value = true
  props.item.carted = true
  emits('cart')
}

function unlike() {
  if (edit?.value) return;
  liked.value = false
  props.item.liked = false
}

function uncart() {
  if (edit?.value) return;
  carted.value = false
  props.item.carted = false
  emits('uncart')
}

function previousImage() {
  if (!mainImage.value || !images) return;
  if (currentIndex === 0) {
    currentIndex = images.length - 1;
  } else {
    currentIndex--;
  }

  const temp = images[currentIndex].src;
  images[currentIndex].src = mainImage.value.src;
  mainImage.value.src = temp;
}

function nextImage() {
  if (!mainImage.value || !images) return;
  if (currentIndex === images.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }

  const temp = images[currentIndex].src;
  images[currentIndex].src = mainImage.value.src;
  mainImage.value.src = temp;
}

onMounted(() => {
  images = mainImage.value?.parentElement?.querySelectorAll('.image') as NodeListOf<HTMLImageElement>;
})
</script>
<template>
  <div class="shop-card">
    <div class="close-icon-container" v-if="edit">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="emits('delete', item.index)"
        class="close-icon">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z"
          fill="#d22020" />
      </svg>
    </div>
    <div class="parent-images-container">
      <span class="indicator-left" @click="previousImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.823 240.823">
          <path
            d="M183.189 111.816L74.892 3.555c-4.752-4.74-12.451-4.74-17.215 0-4.752 4.74-4.752 12.439 0 17.179l99.707 99.671-99.695 99.671c-4.752 4.74-4.752 12.439 0 17.191 4.752 4.74 12.463 4.74 17.215 0l108.297-108.261c4.68-4.691 4.68-12.511-.012-17.19z" />
        </svg>
      </span>

      <span class="indicator-right" @click="nextImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.823 240.823">
          <path
            d="M183.189 111.816L74.892 3.555c-4.752-4.74-12.451-4.74-17.215 0-4.752 4.74-4.752 12.439 0 17.179l99.707 99.671-99.695 99.671c-4.752 4.74-4.752 12.439 0 17.191 4.752 4.74 12.463 4.74 17.215 0l108.297-108.261c4.68-4.691 4.68-12.511-.012-17.19z" />
        </svg>
      </span>
      <div class="images-container">
        <img :src="item?.images[0]" alt="Main Image" class="image main-image" ref="mainImage" />
        <div>
          <img v-for="image in item?.images?.slice(1)" :key="image" :src="image" alt="Other Image" class="image" />
        </div>
      </div>
    </div>

    <div class="shop-card-details">
      <div class="item-details">
        <div class="name"><a href="">{{ item.name }}</a></div>
        <div class="price">KES {{ item.price }}</div>
      </div>

      <div class="shop-card-buttons">
        <div class="shop-card-icon">
          <Transition mode="out-in">
            <svg width="96px" height="96px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" v-if="carted"
              @click="uncart" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs>
                <clipPath id="clip-heart">
                  <rect width="96" height="96" />
                </clipPath>
              </defs>
              <g id="heart" clip-path="url(#clip-heart)">
                <g id="pills" transform="translate(-116 -232)">
                  <g id="Group_150" data-name="Group 150">
                    <path id="Path_180" data-name="Path 180"
                      d="M164,247.762c-.092-.1-.184-.194-.276-.286A25.568,25.568,0,1,0,127.5,283.57c.1.1.2.2.316.3h0L164,320l36.224-36.093-.041-.041c.112-.092.214-.194.316-.3a25.568,25.568,0,1,0-36.223-36.094C164.184,247.568,164.092,247.66,164,247.762Z"
                      fill="#df208f" stroke="#df208f" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                  </g>
                </g>
              </g>
            </svg>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px" y="0px" viewBox="0 0 490.4 490.4" style="enable-background:new 0 0 490.4 490.4;"
              xml:space="preserve" v-else @click="cart">
              <g>
                <g fill="#df208f">
                  <path d="M222.5,453.7c6.1,6.1,14.3,9.5,22.9,9.5c8.5,0,16.9-3.5,22.9-9.5L448,274c27.3-27.3,42.3-63.6,42.4-102.1
                    c0-38.6-15-74.9-42.3-102.2S384.6,27.4,346,27.4c-37.9,0-73.6,14.5-100.7,40.9c-27.2-26.5-63-41.1-101-41.1
                    c-38.5,0-74.7,15-102,42.2C15,96.7,0,133,0,171.6c0,38.5,15.1,74.8,42.4,102.1L222.5,453.7z M59.7,86.8
                    c22.6-22.6,52.7-35.1,84.7-35.1s62.2,12.5,84.9,35.2l7.4,7.4c2.3,2.3,5.4,3.6,8.7,3.6l0,0c3.2,0,6.4-1.3,8.7-3.6l7.2-7.2
                    c22.7-22.7,52.8-35.2,84.9-35.2c32,0,62.1,12.5,84.7,35.1c22.7,22.7,35.1,52.8,35.1,84.8s-12.5,62.1-35.2,84.8L251,436.4
                    c-2.9,2.9-8.2,2.9-11.2,0l-180-180c-22.7-22.7-35.2-52.8-35.2-84.8C24.6,139.6,37.1,109.5,59.7,86.8z" />
                </g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
              <g>
              </g>
            </svg>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-card {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  aspect-ratio: 1/1;
  isolation: isolate;
  position: relative;
}

.parent-images-container {
  position: relative;
  border-radius: 10px;
  width: 100%;
}

.images-container {
  display: flex;
  flex-direction: column;
}

.images-container>div {
  display: flex;
  margin-top: 10px;
  gap: 10px;
}

.image.main-image {
  border-radius: 8px;
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  z-index: -1;
  transition: opacity 0.5s;
}

.image:not(.main-image) {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  object-fit: cover;
  cursor: pointer;
  object-position: top;
}

.image {
  transition: all 0.5s ease;
}

.indicator-left,
.indicator-right {
  position: absolute;
  top: 40%;
  background-color: rgba(0, 0, 0, 0.2);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;

}

.indicator-left svg,
.indicator-right svg {
  fill: #d3d0d0;
  margin-left: 0.2rem;
}

.indicator-left:hover,
.indicator-right:hover {
  background-color: rgba(0, 0, 0, 0.4);
}


.indicator-left {
  left: 0;
  rotate: 180deg;
  transform: translateY(50%);
}

.indicator-right {
  right: 0;
  transform: translateY(-50%);
}

.shop-card-details {
  display: flex;
  flex-direction: column;
  position: relative;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name {
  font-size: 1.2rem;
  margin-top: 1rem;
}

.price {
  font-size: 1.05rem;
}

.shop-card-buttons {
  display: flex;
  gap: 1rem;
}

.shop-card-icon {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(50%);
  padding: 0.5rem;
}

.shop-card-icon svg {
  width: 30px;
  height: 30px;
}

.main-image {
  width: 100%;
}

svg {
  width: 20px;
  height: 20px;
}

.transition-enter-active,
.transition-leave-active {
  transition: opacity 0.5s;
}

.transition-enter,
.transition-leave-to {
  opacity: 0;
}

.transition-enter-to,
.transition-leave {
  opacity: 1;
}

.close-icon-container {
  cursor: pointer;
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  width: 80%;
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 100;
}

.close-icon {
  margin-top: 1px;
  pointer-events: auto;
  width: 20px;
  height: 20px;
}
</style>
