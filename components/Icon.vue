<script setup lang="ts">
import { type CSSProperties } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  styles: {
    type: Object as PropType<CSSProperties>,
    required: false,
    default: () => ({
      width: "30px",
      height: "30px"
    } as CSSProperties)
  }
})

function clean(svg: string | null | undefined) {
  if (!svg) return 'ℹ️'
  const rules = Object.entries(props.styles)
    .map(([key, value]) => {
      const kebab = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
      return `${kebab}: ${value};`
    })
    .join(' ');
  return svg.replace(/<svg/, `<svg style="${rules}"`)
    .replace(/fill="#[0-9a-fA-F]+"/g, 'fill="currentColor"')
}

const {data} = await useFetch<string>(`/icons/${props.name}.svg`, {
  responseType: 'text',
  watch: [props]
}).catch(e => {
  console.error('Failed to fetch icon', e)
  return Promise.resolve({data: null})
})

const icon = computed(() => clean(data?.value))
</script>

<template>
  <div v-html="icon"></div>
</template>