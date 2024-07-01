import {defineNuxtModule, createResolver, addComponentsDir, addImportsDir} from '@nuxt/kit'
import type * as Types from './runtime/types'

export type {Types}

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
    addImportsDir(resolver.resolve('./runtime/utils'), {
      prepend: true
    })
    addComponentsDir({
      path: resolver.resolve('./runtime/components')
    }).then()
  },
})
