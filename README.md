# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup
git init
git add .
git commit -m "Initial Nuxt 3 SSR project"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main

int nuxt:
npx nuxi init
npm install
test --> npm run dev
npx nuxi@latest module add vuetify-nuxt-module

minimalist config;
// app/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives
  })

  nuxtApp.vueApp.use(vuetify)
})

// /nuxt-config.ts
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

<!-- app/pages/index.vue -->
 <template>
  <div>
    <h1>Clima Coaching SSR</h1>
    <p>Nuxt 4 kompatibilis alap rendben fut 🎯</p>
  </div>
  <v-container class="pa-4">
    <v-btn color="primary">Vuetify működik</v-btn>
  </v-container>
</template>

<!-- /app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
