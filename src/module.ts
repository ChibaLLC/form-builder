import {defineNuxtModule, createResolver, addComponentsDir, addImportsDir} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-form-builder',
    configKey: 'nuxtFormBuilder',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    // @ts-ignore
    const resolver = createResolver(import.meta.url)

    addImportsDir([
      resolver.resolve('./runtime/typings'),
      resolver.resolve('./runtime/utils'),
    ], {
      prepend: true
    })

    addComponentsDir({
      path: resolver.resolve('./runtime/components')
    })
  },
})
