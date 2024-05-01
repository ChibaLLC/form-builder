<script setup lang="ts">
import {type CSSProperties} from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  styles: {
    type: Object as PropType<CSSProperties>,
    required: false,
    default: () => ({})
  }
})

function clean(svg: string | undefined) {
  if (!svg) return ''
  const rules = Object.entries(props.styles)
      .map(([key, value]) => {
        const kebab = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
        return `${kebab}: ${value};`
      })
      .join(' ');
  return svg.replace(/<svg/, `<svg style="${rules}"`)
      .replace(/fill="#[0-9a-fA-F]+"/g, 'fill="currentColor"')
}

async function fetchIcon(){
  return await $fetch<string>(`${window.location.origin}/icons/${props.name}.svg`, {
    responseType: 'text'
  }).then(clean)
      .catch((e) => {
        console.error('Failed to fetch icon', e)
        return Promise.resolve(undefined)
      })
}

const icon = useState<string | undefined>(() => undefined)
if (process.server) {
  // I don't know the implications of this, but it seems to work as intended
  const {readFile} = await import('fs/promises')
  icon.value = await readFile(`./public/icons/${props.name}.svg`, 'utf-8')
      .then(clean)
      .catch((e) => {
        console.error(e)
        return Promise.resolve(undefined)
      })
} else if (!icon.value && process.client) {
  icon.value = await fetchIcon()
}


watch(() => props.name, async () => {
  icon.value = await fetchIcon()
})

watch(() => props.styles, () => {
  icon.value = clean(icon.value)
})
</script>

<template>
  <div v-html="icon"/>
</template>