<script setup lang="ts">
import type { TextareaElementData } from '~/typings';

defineProps({
    data: {
        type: Object as PropType<TextareaElementData>,
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
        <label for="textarea">
            <input :disabled="!edit" autocomplete="off" type="text" id="textarea" class="label" v-model="data.label"
                placeholder="Add a label" />
        </label>
        <label for="description" v-if="data.description || edit">
            <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
                v-model="data.description" placeholder="Add a description (optional)" />
        </label>
        <textarea class="textarea" v-model="data.value"></textarea>
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