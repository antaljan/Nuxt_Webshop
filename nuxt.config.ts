export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  
  nitro: {
    devProxy: {
      '/backend': {
        target: 'https://antaligyongyi.hu/api',
        changeOrigin: true,
        prependPath: true
      }
    }
  },

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  vuetify: {
    icons: {
      defaultSet: 'mdi'
    },
    display: {
      mobileBreakpoint: 'md'
    }
  },

  i18n: {
  locales: [
    { code: 'hu', file: 'hu.ts', language: 'hu-HU' },
    { code: 'en', file: 'en.ts', language: 'en-US' },
    { code: 'de', file: 'de.ts', language: 'de-DE' }
  ],
  defaultLocale: 'hu',
  strategy: 'prefix_except_default',
  lazy: true,
  langDir: 'locales',
},

  build: {
    transpile: ['vuetify']
  },

  vite: {
    define: { 'process.env.DEBUG': false }
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    public: {
      backendBase: process.env.BACKEND_BASE_URL || 'https://antaligyongyi.hu/api'
    }
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
