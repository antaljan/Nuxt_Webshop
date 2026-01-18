export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/i18n'
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  i18n: {
    locales: ['en', 'hu', 'de'],
    defaultLocale: 'hu',
    strategy: 'prefix_except_default',
    vueI18n: 'i18n.config.ts'
  },

  build: {
    transpile: ['vuetify']
  },

  vite: {
    define: { 'process.env.DEBUG': false }
  },

  app: {
    head: {
      title: 'A Te utad a Te életed!',
      meta: [
        {
          name: 'description',
          content: 'Webshop & content platform for coaches'
        }
      ]
    }
  }
})
