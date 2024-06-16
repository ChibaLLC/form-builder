import {defineNuxtModule, createResolver, addComponentsDir, addImports, addImportsDir} from '@nuxt/kit'

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

    addImportsDir(resolver.resolve('./runtime/utils'))

    addComponentsDir({
      path: resolver.resolve('./runtime/components')
    })
  },
})
