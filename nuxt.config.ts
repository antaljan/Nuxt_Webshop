// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],
  css: ['vuetify/styles'],
  build: { transpile: ['vuetify'] },
  vite: { define: { 'process.env.DEBUG': false } }
})