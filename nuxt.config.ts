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
  moduleOptions: {},
  vuetifyOptions: {
    icons: { defaultSet: 'mdi' },
    display: { mobileBreakpoint: 'md' },
    locale: {
      locale: 'hu',
      fallback: 'en',
      adapter: 'vue-i18n'
    },
    theme: {
      defaultTheme: 'brandTheme',
      themes: {
        brandTheme: {
          dark: false,
          colors: {
            primary: '#29459e',
            secondary: '#6d96d4',
            background: '#ffffff',
            surface: '#fdfdfd',
            info: '#ffffff',
            success: '#59da4d',
            warning: '#d4d651',
            error: '#ce4040'
          }
        }
      }
    }
  }
}
,
  security: {
    // Itt kapcsoljuk ki a hibás fejléc-kezelést
    headers: false, 
    // Itt adjuk meg az alapvető CSP-t a modul újabb logikája szerint
    contentSecurityPolicy: {
      'img-src': ["'self'", "data:", "https://antaligyongyi.hu", "https://*.bunny.net"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com", "https://meet.jit.si"],
      'connect-src': ["'self'", "https:", "wss:", "ws:", "http://localhost:*", "wss://meet.jit.si"],
      'frame-src': ["'self'", "https://js.stripe.com", "https://iframe.mediadelivery.net", "https://*.bunny.net", "https://*.mediadelivery.net", "https://meet.jit.si"],
      'frame-ancestors': ["'self'"]
    }
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
      ],
      script: [
        { src: 'https://meet.jit.si', defer: true }
      ]
    }
  }
})