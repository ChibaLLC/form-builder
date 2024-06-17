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
    const resolver = createResolver(import.meta.url)
    _nuxt.options.css.push(resolver.resolve('./runtime/assets/css/styles.css'))

    addImportsDir(resolver.resolve('./runtime/utils'), {
      prepend: true
    })

    addComponentsDir({
      path: resolver.resolve('./runtime/components')
    }).then()
  },
})
