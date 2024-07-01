import {defineNuxtModule, createResolver, addComponentsDir, addImportsDir, addImports} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-form-builder',
    configKey: 'nuxtFormBuilder',
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addImports({
      from: resolver.resolve('./runtime/types'),
      type: true,
      name: 'FBTypes',
    })
    addImportsDir(resolver.resolve('./runtime/utils'), {
      prepend: true
    })
    addComponentsDir({
      path: resolver.resolve('./runtime/components')
    }).then()
  },
})
