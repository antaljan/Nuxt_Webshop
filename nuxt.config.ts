import allGet from "./server/api/booking/all.get"

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    '@nuxt/fonts',
    '@nuxtjs/sitemap'
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
  //security: { enabled: false }
  security: {
    headers: false, 
    contentSecurityPolicy: {
      'img-src': ["'self'", "data:", "https://antaligyongyi.hu", "https://*.bunny.net"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com", "https://meet.jit.si", "https://8x8.vc"],
      'connect-src': ["'self'", "https:", "wss:", "ws:", "http://localhost:*", "https://meet.jit.si", "https://*.8x8.vc", "wss://meet.jit.si"],
      'frame-src': ["'self'", "https://js.stripe.com", "https://iframe.mediadelivery.net", "https://*.bunny.net", "https://*.mediadelivery.net","https://meet.jit.si", "https://8x8.vc", "https://*.8x8.vc"],
      'child-src': ["https://meet.jit.si", "https://8x8.vc"],
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

  sitemap: {
    sitemaps: false,
    autoLastmod: false,
    strictNuxtContentPaths: false,
    exclude: [
      '/admin/**',
      '/user/**',
      '/checkout/**',
      '/login',
      '/logout',
      '/register',
      '/reset-password',
      '/forgot-password',
      '/subscribe',
    ],
    routes: async () => {
      const routes = []
      // Statikus oldalak
      routes.push('/')
      routes.push('/hu')
      routes.push('/en')
      routes.push('/de')
      routes.push('/kapcsolat')
      // BLOG BEJEGYZÉSEK – HELYES API HÍVÁS
      const config = useRuntimeConfig()
      const backendBase = config.public.backendBase
      // magyar
      const postsHu = await $fetch(`${backendBase}/posts`, {
        params: { language: 'hu' }
      })
      postsHu.forEach(post => {
        routes.push(`/blog/${post.slug}`)
      })
      // angol
      const postsEn = await $fetch(`${backendBase}/posts`, {
        params: { language: 'en' }
      })
      postsEn.forEach(post => {
        routes.push(`/en/blog/${post.slug}`)
      })
      // német
      const postsDe = await $fetch(`${backendBase}/posts`, {
        params: { language: 'de' }
      })
      postsDe.forEach(post => {
        routes.push(`/de/blog/${post.slug}`)
      })
      return routes
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