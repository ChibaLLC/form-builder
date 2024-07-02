<script setup lang="ts">
import {ref, onMounted, type PropType} from 'vue'
import type {Item} from '../../types'

const liked = ref(false);
const carted = ref(false);
let images: NodeListOf<HTMLImageElement> | null = null;
const mainImage = ref<HTMLImageElement | null>(null);
let currentIndex = 0;

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  }
})

const emits = defineEmits<{
  cart: [],
  uncart: [],
}>()


function like() {
  liked.value = true
  props.item.liked = true
}

function cart() {
  carted.value = true
  props.item.carted = true
  emits('cart')
}

function unlike() {
  liked.value = false
  props.item.liked = false
}

function uncart() {
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
    <div class="parent-images-container">
      <span class="indicator-left" @click="previousImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.823 240.823">
          <path
            d="M183.189 111.816L74.892 3.555c-4.752-4.74-12.451-4.74-17.215 0-4.752 4.74-4.752 12.439 0 17.179l99.707 99.671-99.695 99.671c-4.752 4.74-4.752 12.439 0 17.191 4.752 4.74 12.463 4.74 17.215 0l108.297-108.261c4.68-4.691 4.68-12.511-.012-17.19z"/>
        </svg>
      </span>

      <span class="indicator-right" @click="nextImage">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.823 240.823">
          <path
            d="M183.189 111.816L74.892 3.555c-4.752-4.74-12.451-4.74-17.215 0-4.752 4.74-4.752 12.439 0 17.179l99.707 99.671-99.695 99.671c-4.752 4.74-4.752 12.439 0 17.191 4.752 4.74 12.463 4.74 17.215 0l108.297-108.261c4.68-4.691 4.68-12.511-.012-17.19z"/>
        </svg>
      </span>
      <div class="images-container">
        <img :src="item.images[0]" alt="Main Image" class="image main-image" ref="mainImage"/>
        <div>
          <img v-for="image in item.images?.slice(1)" :key="image" :src="image" alt="Other Image" class="image"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 494.059 494.059" v-if="!carted" @click="cart">
              <path fill="#323232"
                    d="M94.293 322.206c1.168 11.504 7.392 21.823 16.249 28.792-4.958 5.834-7.959 13.379-7.959 21.616v30.88a33.324 33.324 0 0018.942 30.161 46.852 46.852 0 00-.976 9.523c0 25.815 21.002 46.817 46.816 46.817 25.815 0 46.817-21.002 46.817-46.817 0-2.116-.154-4.196-.428-6.238h77.006a47.036 47.036 0 00-.428 6.238c0 25.815 21.002 46.817 46.817 46.817 25.814 0 46.816-21.002 46.816-46.817s-21.002-46.817-46.816-46.817c-15.66 0-29.538 7.736-38.042 19.579h-93.701c-8.504-11.843-22.382-19.579-38.042-19.579-15.045 0-28.446 7.142-37.017 18.205a12.39 12.39 0 01-6.767-11.071v-30.88c0-6.858 5.583-12.437 12.446-12.437.032 0 .063-.004.095-.005.064.001.128.005.191.005h245.5c20.299 0 41.324-15.049 47.868-34.261l62.384-183.173c3.53-10.364 2.329-20.814-3.296-28.671-5.624-7.857-15.129-12.364-26.077-12.364h-22.39l-67.472-67.795c-10.49-10.488-27.493-10.579-38.105-.284L220.858 64.258 190.292 9.452c-2.824-5.064-9.218-6.879-14.284-4.056l-61.135 34.096a10.494 10.494 0 00-4.986 6.303 10.495 10.495 0 00.931 7.982l26.732 47.931h-25.325c-6.753 0-13.114 1.725-18.63 4.959l-4.958-49.569a10.5 10.5 0 00-10.448-9.455H10.5c-5.799 0-10.5 4.701-10.5 10.5s4.701 10.5 10.5 10.5h58.187l25.606 253.563zm242.858 95.154c14.235 0 25.816 11.582 25.816 25.817s-11.581 25.817-25.816 25.817-25.817-11.581-25.817-25.817 11.582-25.817 25.817-25.817zm-169.785 0c14.235 0 25.817 11.582 25.817 25.817s-11.582 25.817-25.817 25.817-25.816-11.581-25.816-25.817 11.581-25.817 25.816-25.817zM357.967 48.745l52.71 52.963H296.333l52.943-52.944c2.401-2.401 6.306-2.401 8.691-.019zm-53.008 14.638l-38.324 38.325h-24.89l-10.34-18.539 73.554-19.786zM134.271 52.718l42.795-23.867 40.634 72.857h-56.106l-27.323-48.99zm337.917 83.254l-62.384 183.173c-3.635 10.671-16.714 20.031-27.989 20.031h-245.5c-10.403 0-20.08-8.743-21.13-19.09l-3.71-36.594h225.748c5.799 0 10.5-4.701 10.5-10.5s-4.701-10.5-10.5-10.5H109.347L96.921 139.92v-.006l-.002-.023c-.473-4.669.879-9.024 3.809-12.266 2.865-3.171 6.948-4.917 11.497-4.917h323.618c.035.001.068.005.103.005.034 0 .068-.004.102-.005h26.647c4.148 0 7.346 1.274 9.001 3.587 1.656 2.312 1.83 5.749.492 9.677z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 494.059 494.059" v-else @click="uncart">
              <path fill="green"
                    d="M94.293 322.206c1.168 11.504 7.392 21.823 16.249 28.792-4.958 5.834-7.959 13.379-7.959 21.616v30.88a33.324 33.324 0 0018.942 30.161 46.852 46.852 0 00-.976 9.523c0 25.815 21.002 46.817 46.816 46.817 25.815 0 46.817-21.002 46.817-46.817 0-2.116-.154-4.196-.428-6.238h77.006a47.036 47.036 0 00-.428 6.238c0 25.815 21.002 46.817 46.817 46.817 25.814 0 46.816-21.002 46.816-46.817s-21.002-46.817-46.816-46.817c-15.66 0-29.538 7.736-38.042 19.579h-93.701c-8.504-11.843-22.382-19.579-38.042-19.579-15.045 0-28.446 7.142-37.017 18.205a12.39 12.39 0 01-6.767-11.071v-30.88c0-6.858 5.583-12.437 12.446-12.437.032 0 .063-.004.095-.005.064.001.128.005.191.005h245.5c20.299 0 41.324-15.049 47.868-34.261l62.384-183.173c3.53-10.364 2.329-20.814-3.296-28.671-5.624-7.857-15.129-12.364-26.077-12.364h-22.39l-67.472-67.795c-10.49-10.488-27.493-10.579-38.105-.284L220.858 64.258 190.292 9.452c-2.824-5.064-9.218-6.879-14.284-4.056l-61.135 34.096a10.494 10.494 0 00-4.986 6.303 10.495 10.495 0 00.931 7.982l26.732 47.931h-25.325c-6.753 0-13.114 1.725-18.63 4.959l-4.958-49.569a10.5 10.5 0 00-10.448-9.455H10.5c-5.799 0-10.5 4.701-10.5 10.5s4.701 10.5 10.5 10.5h58.187l25.606 253.563zm242.858 95.154c14.235 0 25.816 11.582 25.816 25.817s-11.581 25.817-25.816 25.817-25.817-11.581-25.817-25.817 11.582-25.817 25.817-25.817zm-169.785 0c14.235 0 25.817 11.582 25.817 25.817s-11.582 25.817-25.817 25.817-25.816-11.581-25.816-25.817 11.581-25.817 25.816-25.817zM357.967 48.745l52.71 52.963H296.333l52.943-52.944c2.401-2.401 6.306-2.401 8.691-.019zm-53.008 14.638l-38.324 38.325h-24.89l-10.34-18.539 73.554-19.786zM134.271 52.718l42.795-23.867 40.634 72.857h-56.106l-27.323-48.99zm337.917 83.254l-62.384 183.173c-3.635 10.671-16.714 20.031-27.989 20.031h-245.5c-10.403 0-20.08-8.743-21.13-19.09l-3.71-36.594h225.748c5.799 0 10.5-4.701 10.5-10.5s-4.701-10.5-10.5-10.5H109.347L96.921 139.92v-.006l-.002-.023c-.473-4.669.879-9.024 3.809-12.266 2.865-3.171 6.948-4.917 11.497-4.917h323.618c.035.001.068.005.103.005.034 0 .068-.004.102-.005h26.647c4.148 0 7.346 1.274 9.001 3.587 1.656 2.312 1.83 5.749.492 9.677z"/>
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
  margin: 1rem;
  padding: 1rem;
  width: 18vw;
  aspect-ratio: 1/1;
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

.images-container > div {
  display: flex;
  margin-top: 10px;
  gap: 10px;
}

.image.main-image {
  border-radius: 8px;
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
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
  z-index: 100;
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
</style>
