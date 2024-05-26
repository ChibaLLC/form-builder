<script setup lang="ts">
import { type Item } from "~/typings"
let images: Element | null = null
let scrollPosition = 0
let imageSize = 0
const liked = ref(false);
const carted = ref(false);
const context = getCurrentInstance()


defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  }
})

function getClosestImage() {
  images = context?.vnode.el?.querySelector('.images')
  if (!images) return 0
  imageSize = images!.querySelectorAll('img')[0].getBoundingClientRect().width

  scrollPosition = images.scrollLeft

  return Math.floor(scrollPosition / imageSize) * imageSize
}


function scrollLeft() {
  const closestImage = getClosestImage()
  if (!images) return

  if (closestImage !== scrollPosition) {
    images.scrollTo({
      left: closestImage,
      behavior: 'smooth'
    });
    return;
  }

  images.scrollTo({
    left: closestImage - imageSize,
    behavior: 'smooth'
  })
}

function scrollRight() {
  const closestImage = getClosestImage()
  if (!images) return

  if (closestImage !== scrollPosition) {
    images.scrollTo({
      left: closestImage + imageSize,
      behavior: 'smooth'
    })
    return;
  }

  images.scrollTo({
    left: closestImage + imageSize,
    behavior: 'smooth'
  })
}

function like() {
  liked.value = true
}

function cart() {
  carted.value = true
}

function unlike() {
  liked.value = false
}

function uncart() {
  carted.value = false
}
</script>
<template>
  <div class="shop-card">
    <div class="images-container">
      <span class="indicator-left" @click="scrollLeft"><img src="/icons/arrow.svg" alt="<"></span>

      <span class="indicator-right" @click="scrollRight"><img src="/icons/arrow.svg" alt="<"></span>
      <div class="images">
        <div v-for="(image, index) in item.images" :key="image" :class="{ 'main-image': index === 0 }">
          <img :src="image" alt="Shop Item">
        </div>
      </div>
    </div>

    <div class="shop-card-details">
      <div class="item-details">
        <div class="name"><a href="">{{ item.name}}</a></div>
        <div class="price">KES {{ item.price}}</div>
      </div>

      <div class="shop-card-buttons">
        <div class="shop-card-icon">
          <Transition mode="out-in">
            <Icon name="cart" v-if="!carted" @click="cart" :styles="{}" />
            <Icon name="cart" :styles="{}" alt="" v-else @click="uncart"/>
          </Transition>
        </div>
        <div class="shop-card-icon">
          <Transition mode="out-in">
            <Icon v-if="!liked" @click="like" name="like" :styles="{}"/>
            <Icon name="like" v-else @click="unlike" :styles="{}" />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop-card {
  .images-container {
    height: 310px;
    width: 310px;
    display: flex;
    align-items: center;
    isolation: isolate;
    position: relative;

    .main-image {
      position: absolute;
      transition: opacity 0.2s ease-in-out;
    }

    &:hover,
    &:focus-within {
      .main-image {
        opacity: 0;
        pointer-events: none;
      }
    }

    .indicator-left,
    .indicator-right {
      position: absolute;
      color: white;
      font-size: xx-large;
      background-color: #bbbbbb;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: grid;
      place-items: center;

      img {
        margin-left: 2px;
        width: 50%;
        height: 50%;
        opacity: 0.5;
      }
    }

    .indicator-left {
      left: 0;
    }

    .indicator-right {
      right: 0;
    }

    .indicator-left:hover,
    .indicator-right:hover {
      cursor: pointer;
      background-color: var(--cooler-white);
    }

    .indicator-left {
      rotate: -180deg;
    }

    ::-webkit-scrollbar {
      display: none;
    }

    .images {
      display: flex;
      overflow-x: scroll;
      overflow-y: hidden;
      align-items: center;
      width: 100%;
      height: 100%;

      div {
        width: inherit;
        height: inherit;

        img {
          width: 310px;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }
      }
    }
  }

  .shop-card-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    background-color: #17191c;
    padding: 0.5rem;

    .item-details {
      .name {
        font-size: x-large;
      }

      .price {
        font-size: large;
        color: #bbbbbb;
      }
    }


    .shop-card-buttons {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;


      .shop-card-icon:nth-child(1) {
        margin-left: 15px;
      }

      .shop-card-icon:nth-child(2) {
        margin-left: 10px;
      }

      .shop-card-icon:last-child {
        a {
          padding: 0.5rem 1rem;
          color: white;
          background-color: var(--cooler-twelve);
        }
      }

      .shop-card-icon {
        img {
          width: 30px;
          height: 30px;
        }

        >* {
          cursor: pointer;
        }
      }
    }
  }
}
</style>