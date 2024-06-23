<script setup lang="ts">
import {type CSSProperties, type PropType} from "vue";
import {Field} from "../../../../utils/constants";

const emit = defineEmits(['dragstart'])

defineProps({
  styles: {
    type: Object as PropType<CSSProperties>,
    required: true
  }
})

function search(event: any) {
  const value = event.target.value.toLowerCase()
  const items = document.querySelectorAll('.panel-items li')
  items.forEach((item: any) => {
    const title = item.querySelector('h3').textContent.toLowerCase()
    const description = item.querySelector('p').textContent.toLowerCase()
    if (title.includes(value) || description.includes(value)) {
      item.style.display = 'block'
    } else {
      item.style.display = 'none'
    }
  })
}
</script>

<template>
  <div class="panel" :style="styles">
    <div class="search-box">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
        <path
          d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z">
        </path>
      </svg>
      <input placeholder="Search Elements" class="search" @input="search($event)"/>
    </div>
    <ul class="panel-items">
      <li>
        <FormBuilderPanelPicker @dragstart="emit('dragstart', Field.EMAIL)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"
                 style="width: 15px; height: 15px;"
                 id="Sign-At--Streamline-Flex">
              <g id="sign-at--mail-email-at-sign-read-address">
                <path id="Union" fill="currentColor" fill-rule="evenodd"
                      d="M1.5 7c0 -1.86195 0.52135 -3.21069 1.40533 -4.09467C3.78931 2.02135 5.13805 1.5 7 1.5c1.86195 0 3.2107 0.52135 4.0947 1.40533C11.9786 3.78931 12.5 5.13805 12.5 7c0 0.67465 -0.1261 1.26106 -0.3353 1.64942 -0.1973 0.36628 -0.4168 0.48571 -0.6647 0.48571 -0.3799 0 -0.5461 -0.08981 -0.6198 -0.1493 -0.0758 -0.06111 -0.1462 -0.16472 -0.1953 -0.36303 -0.0511 -0.20605 -0.0656 -0.45974 -0.0627 -0.75903 0.0009 -0.08429 0.0037 -0.18453 0.0067 -0.29031v-0.00003c0.0057 -0.19961 0.0119 -0.41892 0.0061 -0.58779 -0.0027 -1.05537 -0.3038 -1.98499 -0.96979 -2.65097 -0.669 -0.66899 -1.60404 -0.9698 -2.66533 -0.9698 -1.0613 0 -1.99634 0.30081 -2.66533 0.9698 -0.66899 0.669 -0.9698 1.60404 -0.9698 2.66533s0.30081 1.99633 0.9698 2.66533c0.66899 0.66897 1.60403 0.96977 2.66533 0.96977 1.01151 0 1.90833 -0.2732 2.56943 -0.87805 0.09892 0.1418 0.22024 0.27615 0.36909 0.39625 0.4106 0.3312 0.9415 0.4818 1.5616 0.4818 0.9521 0 1.6076 -0.5731 1.9853 -1.27438C13.8511 8.68151 14 7.82535 14 7c0 -2.13805 -0.6036 -3.91431 -1.8447 -5.15533C10.9143 0.603648 9.13805 0 7 0 4.86195 0 3.08569 0.603648 1.84467 1.84467 0.603648 3.08569 0 4.86195 0 7c0 2.13805 0.603648 3.9143 1.84467 5.1553C3.08569 13.3964 4.86195 14 7 14c0.90329 0 1.74065 -0.1072 2.50169 -0.3253 0.39819 -0.1141 0.62851 -0.5293 0.51441 -0.9275 -0.11408 -0.3982 -0.52937 -0.6285 -0.92756 -0.5145C8.48184 12.4066 7.78599 12.5 7 12.5c-1.86195 0 -3.21069 -0.5214 -4.09467 -1.4053C2.02135 10.2107 1.5 8.86195 1.5 7Zm7.63501 -0.00513c-0.00001 0.00282 -0.00002 0.00565 0 0.00848 -0.00062 0.78328 -0.21896 1.28981 -0.53046 1.60132 -0.31196 0.31195 -0.81948 0.53046 -1.60467 0.53046s-1.29272 -0.21851 -1.60467 -0.53046C5.08326 8.29272 4.86475 7.78519 4.86475 7s0.21851 -1.29272 0.53046 -1.60467c0.31195 -0.31195 0.81948 -0.53046 1.60467 -0.53046s1.29271 0.21851 1.60467 0.53046c0.31127 0.31127 0.52951 0.81727 0.53046 1.59954Z"
                      clip-rule="evenodd" stroke-width="1"></path>
              </g>
            </svg>
          </template>
          <template #title>
            <h3>Email</h3>
          </template>
          <template #description>
            <p>A field for inputting an email</p>
          </template>
        </FormBuilderPanelPicker>
      </li>
      <li>
        <FormBuilderPanelPicker @dragstart="emit('dragstart', Field.TEXT)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 14"
                 style="width: 15px; height: 15px;"
                 id="Small-Caps--Streamline-Flex">
              <g id="small-caps">
                <path id="Union" fill="currentColor" fill-rule="evenodd"
                      d="M1.5 1.875c-0.69 0 -1.25 0.56 -1.25 1.25v0.882a0.75 0.75 0 0 0 1.5 0v-0.632H4l0 7.25h-0.917a0.75 0.75 0 0 0 0 1.5h3.334a0.75 0.75 0 0 0 0 -1.5H5.5l0 -7.25h2.25v0.632a0.75 0.75 0 0 0 1.5 0v-0.882c0 -0.69 -0.56 -1.25 -1.25 -1.25H1.5Zm7.5 4c-0.69 0 -1.25 0.56 -1.25 1.25v0.25a0.75 0.75 0 0 0 1.5 0H10v3.25h-0.25a0.75 0.75 0 0 0 0 1.5h2a0.75 0.75 0 0 0 0 -1.5h-0.25v-3.25h0.75a0.75 0.75 0 0 0 1.5 0v-0.25c0 -0.69 -0.56 -1.25 -1.25 -1.25H9Z"
                      clip-rule="evenodd" stroke-width="1"></path>
              </g>
            </svg>
          </template>
          <template #title>
            <h3>Text</h3>
          </template>
          <template #description>
            <p>A field for inputting text</p>
          </template>
        </FormBuilderPanelPicker>
      </li>
      <!--      <li>-->
      <!--        <FormBuilderPanelPicker @dragstart="emit('dragstart', Field.CHECKBOX)">-->
      <!--          <template #icon>-->
      <!--            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"-->
      <!--                 style="width: 15px; height: 15px;">-->
      <!--              <path-->
      <!--                d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM11.0026 16L6.75999 11.7574L8.17421 10.3431L11.0026 13.1716L16.6595 7.51472L18.0737 8.92893L11.0026 16Z">-->
      <!--              </path>-->
      <!--            </svg>-->
      <!--          </template>-->
      <!--          <template #title>-->
      <!--            <h3>Checkbox</h3>-->
      <!--          </template>-->
      <!--          <template #description>-->
      <!--            <p>A field for adding a checkbox</p>-->
      <!--          </template>-->
      <!--        </FormBuilderPanelPicker>-->
      <!--      </li>-->
      <li>
        <FormBuilderPanelPicker @dragstart="emit('dragstart', Field.SELECT)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                 style="width: 15px; height: 15px;">
              <path
                d="M8.00008 6V9H5.00008V6H8.00008ZM3.00008 4V11H10.0001V4H3.00008ZM13.0001 4H21.0001V6H13.0001V4ZM13.0001 11H21.0001V13H13.0001V11ZM13.0001 18H21.0001V20H13.0001V18ZM10.7072 16.2071L9.29297 14.7929L6.00008 18.0858L4.20718 16.2929L2.79297 17.7071L6.00008 20.9142L10.7072 16.2071Z">
              </path>
            </svg>
          </template>
          <template #title>
            <h3>Select</h3>
          </template>
          <template #description>
            <p>A field for adding a dropdown.</p>
          </template>
        </FormBuilderPanelPicker>
      </li>
    </ul>
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

ul {
  list-style: none;
}

a {
  text-decoration: none;
}

.panel {
  width: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: white;
  background-color: #262626;
}

.panel .search-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}


.panel .search-box .search-icon {
  position: absolute;
  color: #737373;
  margin-left: 0.3rem;
  width: 20px;
  height: 20px;
  margin-top: -1px;
}

.search:focus {
  outline: 1px solid rgba(78, 78, 78, 0.1);
}

.panel .search-box .search {
  width: 100%;
  padding: 0.4rem 0 0.4rem 1.8rem;
  border-radius: 4px;
  background-color: #323232;
  color: white;
  border: none;
}

.panel .search-box .search::placeholder {
  color: #737373;
}

.panel .search-box .search:focus {
  outline: none;
}

.panel svg {
  color: #efefef;
}

.panel-items {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h3 {
  font-size: 1rem;
}
</style>
