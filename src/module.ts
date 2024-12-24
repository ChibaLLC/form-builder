import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addImportsDir,
  addServerImportsDir,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-form-builder",
    configKey: "nuxtFormBuilder",
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    const autoImports = resolver.resolve("./runtime/utils");
    addImportsDir(autoImports, {
      prepend: true,
    });
    addServerImportsDir(autoImports, {
      prepend: true,
    });
    addComponentsDir({
      path: resolver.resolve("./runtime/components"),
    });
  },
});
