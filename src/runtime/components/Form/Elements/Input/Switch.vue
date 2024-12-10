<template>
    <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label class="switch">
            <input type="checkbox" @click="toggleCheckbox" :checked="checked">
            <div class="slider round"></div>
        </label>
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import { ref, type PropType, type ShallowRef, type Ref, isRef } from 'vue';


const emit = defineEmits<{
    change: [boolean]
}>()
function toggleCheckbox() {
    checked.value = !checked.value
    if (isRef(props.model)) {
        props.model.value = checked.value
    } else if (props.model) {
        console.warn(props.model, "Is Not A Ref")
    }
    emit('change', checked.value)
}

const props = defineProps({
    model: {
        type: Object as PropType<ShallowRef<boolean> | Ref<boolean>>,
        required: false
    },
    checked: {
        type: Boolean,
        default: () => false
    }
})

const checked = ref(props.checked)
</script>
<style scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 17px;
}

.switch input {
    display: none;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #bbb;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked+.slider {
    background-color: #029c61;
}

input:focus+.slider {
    box-shadow: 0 0 1px #101010;
}

input:checked+.slider:before {
    -webkit-transform: translateX(13px);
    -ms-transform: translateX(13px);
    transform: translateX(13px);
}

.slider.round {
    border-radius: 17px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>