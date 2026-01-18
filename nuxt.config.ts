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
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'hu',
    locales: [
      { code: 'hu', file: 'hu.json' },
      { code: 'en', file: 'en.json' },
      { code: 'de', file: 'de.json' }
    ]
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
