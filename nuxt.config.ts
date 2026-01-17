// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  srcDir: 'app',
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module'],
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: { transpile: ['vuetify'] },
  vite: { define: { 'process.env.DEBUG': false } }, 
  app: {
    head: {
      title: 'Coaching Platform',
      meta: [ 
        { name: 'description', content: 'Webshop & content platform for coaches' } 
      ] 
    } 
  }
})