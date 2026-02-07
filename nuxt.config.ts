export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    '@nuxt/fonts'
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  fonts: { families: [ { name: 'Roboto', provider: 'google' } ] },

  vuetify: {
  icons: { defaultSet: 'mdi' },
  display: { mobileBreakpoint: 'md' },
  locale: {
    locale: 'hu',
    fallback: 'en',
    adapter: 'vue-i18n'
  }
},

  security: {
    headers: {
      referrerPolicy: 'no-referrer-when-downgrade',
      contentSecurityPolicy: {
        'img-src': ["'self'", "data:", "https://antaligyongyi.hu", "https://bunny.net"],
        'script-src': ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
        'frame-src': [
          "'self'",
          "https://js.stripe.com",
          "https://iframe.mediadelivery.net",
          "https://*.bunny.net",
          "https://*.mediadelivery.net"
        ],
        'frame-ancestors': ["'self'"]
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
    },
    // Rate limiting (DDoS)
    rateLimiter: {
      tokensPerInterval: 350,
      interval: 'hour',
    },
    // Request filter (to safe SQL/NoSQL injection)
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 20000000,
    },
  },

  routeRules: {
    '/api/newsletter/create/save': { security: {xssValidator: false} },
    '/api/newsletter/getonetemplate': { security: { xssValidator: false } }
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
    langDir: 'locales'
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
          name: 'Antali Gyöngyi Edit',
          content: 'psychology, Life- and business Coaching, transversal skills development '
        }
      ]
    }
  }
})