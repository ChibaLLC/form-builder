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
  },
  class: {
    type: String,
    required: false,
    default: ''
  }
})

function clean(svg: string | null | undefined) {
  if (!svg) return ""
  let _svg = svg

  if (props.styles) {
    const rules = Object.entries(props.styles)
      .map(([key, value]) => {
        const kebab = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
        return `${kebab}: ${value};`
      })

      .join(' ');

    _svg = svg
      .replace(/<svg/, `<svg style="${rules}"`)
      .replace(/fill="#[0-9a-fA-F]+"/g, 'fill="currentColor"')
  }

  if (props.class) {
    _svg = _svg.replace(/<svg/, `<svg class="${props.class}"`)
  }

  return _svg
}
const data = ref<string | null>(null)
const icon = computed(() => clean(data.value))

async function fetchIcon() {
  const res = await $fetch<string>(`${window.location.origin}/icons/${props.name}.svg`, {
    responseType: 'text'
  }).catch(e => {
    console.error('Failed to fetch icon', e)
    return Promise.resolve("")
  })

  data.value = clean(res)
}

onMounted(setTimeout.bind(null, fetchIcon, 0))

watch(() => props.name, fetchIcon)
</script>

<template>
  <div v-html="icon"></div>
</template>