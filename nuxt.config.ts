export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-security'
  ],

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  vuetify: {
    icons: { defaultSet: 'mdi' },
    display: { mobileBreakpoint: 'md' }
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", "data:", "https://antaligyongyi.hu", "https://bunny.net"],
        'script-src': ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
        'frame-src': ["'self'", "https://js.stripe.com", "https://bunny.net"],
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
      maxRequestSizeInBytes: 2000000, // 2MB
      maxUploadFileRequestInBytes: 20000000, // 20MB a PDF-ekhez
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
          content: 'Pscichology, Life- and Bussiness Coaching, Trasnversal skills development '
        }
      ]
    }
  }
})