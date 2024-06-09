<script setup lang="ts">
import type { FormElementData } from '~/typings';

defineProps({
    data: {
        type: Object as PropType<FormElementData[]>,
        required: true
    }
})

const emits = defineEmits<{
    submit: []
}>()
</script>
<template>
    <div class="w-full m-auto max-w-[800px]">
        <form class="bg-white h-fit min-h-32 rounded relative py-2" @submit.prevent="emits('submit')">
            <FormBuilderRenderer v-for="element in data" :key="element.index!" :data="element" :edit="false"/>
        </form>
    </div>
</template>