import type {ElementOptions} from "./types";

export async function parseElementOptions(options: ElementOptions | undefined): Promise<{ label: string, value: string }[]> {
  if (options === undefined) return Promise.resolve([])

  function format(item: any) {
    if (Array.isArray(item)) {
      return item.map((option) => {
        if (typeof option === 'string') {
          return { label: option, value: option }
        } else {
          if (option.label && option.value) {
            return option
          } else {
            return Object.keys(option).map((key) => ({ label: key, value: option[key] }))
          }
        }
      })
    }

    if (typeof item === 'string') {
      try {
        return format(JSON.parse(item))
      } catch (e) {
        return item.split(', ').map((option) => ({ label: option, value: option }))
      }
    }

    if (typeof item === 'object') {
      if (item.label && item.value) {
        return [item]
      } else {
        return Object.keys(item).map((key) => ({ label: key, value: item[key] }))
      }
    }

    console.warn("Un-parsable options")
    return []
  }

  switch (typeof options) {
    case 'function':
      return Promise.resolve(options()).then(parseElementOptions)
    case 'string':
      if (options.startsWith('http')) {
        try {
          return $fetch<string>(options, { responseType: 'text' }).then(format)
        } catch (e) {
          return Promise.resolve([])
        }
      } else {
        try {
          return Promise.resolve(format(options))
        } catch (e) {
          return Promise.resolve([])
        }
      }
    case 'object':
      return Promise.resolve(format(options))
    default:
      return Promise.resolve([])
  }
}
