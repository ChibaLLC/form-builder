<script setup lang="ts">
defineProps({
    data: {
        type: Object as PropType<InputElementData>,
        required: true
    },
    edit: {
        type: Boolean as PropType<boolean>,
        default: true
    }
})

</script>
<template>
    <FormElementsInputTextarea v-if="isTextarea(data.type)" :data="data as TextareaElementData" :edit="edit" />
    <FormElementsInputSelect v-else-if="isSelect(data.type)" :data="data as SelectElementData" :edit="edit" />
    <FormElementsInputRadio v-else-if="isRadio(data.type)" :data="data as RadioElementData" :edit="edit" />
    <FormElementsInputCheckbox v-else-if="isCheckbox(data.type)" :data="data as CheckboxElementData" :edit="edit" />
    <FormElementsInputImage v-else-if="isImageInput(data.type)" :data="data as ImageInputElementData" :edit="edit" />
    <FormElementsInputFile v-else-if="isFileInput(data.type)" :data="data as FileInputElementData" :edit="edit" />
    <FormElementsInputSelect v-else-if="isSelect(data.type)" :data="data as SelectElementData" :edit="edit" />
    <div v-else class="flex flex-col m-auto w-[80%]">
        <label for="label">
            <input :disabled="!edit" autocomplete="off" :type="data.inputType" id="label" class="label"
                v-model="data.label" placeholder="Add a label" />
        </label>
        <label for="description" v-if="(data.description && data.description.length > 0) || edit">
            <input :disabled="!edit" autocomplete="off" type="text" id="description" class="description"
                v-model="data.description" placeholder="Add a description (optional)" />
        </label>
        <input autocomplete="off" :type="data.inputType" :accept="data.accept" v-model="data.value" />
    </div>
</template>
<style scoped lang="scss">
input,
select,
textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
}

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
