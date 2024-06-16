import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/runtime/components/**/*.vue",
    "./playground/app.vue"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

