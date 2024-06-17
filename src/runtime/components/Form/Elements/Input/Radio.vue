<script setup lang="ts">
import { type PropType } from 'vue'
import type {RadioElementData} from "../../../../typings";
const props = defineProps({
    data: {
        type: Object as PropType<RadioElementData>,
        required: true
    },
    edit: {
        type: Object as PropType<boolean>,
        default: true
    }
})
</script>

<template>
    <div class="flex flex-col m-auto w-[80%]">
        <div v-if="!edit" v-for="option in data.options">
            <label>{{ option.label }}</label>
            <input autocomplete="off" type="radio" :value="option.value" />
        </div>
        <div v-else class="adoptions">

        </div>
    </div>
</template>

<style scoped lang="scss">
label {
    width: 100%;

    &:first-child {
        margin-top: 1rem;
    }

    &:not(:focus) {
        input {
            all: unset;
            cursor: pointer;
            transition: padding 0.25s, border-radius 0.25s;
            width: 100%;
            text-wrap: normal;
            text-overflow: ellipsis;

            &::placeholder {
                color: #4e4e4e;
            }

            &.label {
                font-weight: bold;
                color: black;
            }

            &.description {
                margin-bottom: 0.8em;
                font-size: 0.9rem;
                color: black;
            }
        }
    }

    &:focus-within,
    &:focus {
        input {
            cursor: text;
            background-color: #f0f0f0;
            border-radius: 0.25rem;
            padding: 0.5rem;
            color: black !important;
            width: fit-content;

            transition: padding 0.25s, border-radius 0.25s;
        }
    }

    &:hover:not(:focus-within) {
        input::placeholder {
            text-decoration: underline;
        }
    }
}
</style>
