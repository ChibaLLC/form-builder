export default defineNuxtConfig({
  modules: ['../src/module', '@nuxtjs/tailwindcss'],
  formBuilder: {},
  tailwindcss: {
    configPath: '../tailwind.config.ts',
  },
  devtools: { enabled: true },
})
