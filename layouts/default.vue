<script setup lang="ts">
import MyHeader from '~/components/MyHeader.vue'
import MyFooter from '~/components/MyFooter.vue'
import CartDrawer from '~/components/CartDrawer.vue'
import CookieBanner from '~/components/CookieBanner.vue'
import BrandThemeUpdater from '~/components/BrandThemeUpdater.vue'

import { useAuth } from '@/composables/useAuth'
import { useBrand } from '@/composables/useBrand'
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted, watchEffect } from 'vue'

/* -----------------------------------------
   LOAD BRAND + USER (SSR SAFE)
----------------------------------------- */
const { settings, loadBrand } = useBrand()
const { user, loggedIn, isAdmin, fetchUser } = useAuth()

if (process.server || !settings.value) {
  await Promise.all([
    loadBrand(),
    !user.value ? fetchUser() : Promise.resolve()
  ])
}

/* -----------------------------------------
   HEADER MODE (admin / user / visitor)
----------------------------------------- */
const headerMode = computed(() => {
  if (isAdmin.value) return 'admin'
  if (loggedIn.value) return 'user'
  return 'visitor'
})

/* -----------------------------------------
   LAYOUT MODE (default / maintenance)
----------------------------------------- */
const layoutMode = computed(() => {
  if (settings.value?.maintenanceMode) {
    // maintenance alatt csak admin láthatja a menüt
    return isAdmin.value ? 'default' : 'maintenance'
  }
  return 'default'
})

/* -----------------------------------------
   BRAND THEME CSS VARIABLES
----------------------------------------- */
onMounted(() => {
  watchEffect(() => {
    if (!settings.value) return
    const root = document.documentElement

    root.style.setProperty('--primary', settings.value.primaryColor || '#673fff')
    root.style.setProperty('--background', settings.value.backgroundColor || '#ffffff')
    root.style.setProperty('--text', settings.value.textColor || '#222222')
    root.style.setProperty('--accent', settings.value.accentColor || '#8566ff')
    root.style.setProperty('--font-family', settings.value.fontFamily || 'Roboto')
  })
})

/* -----------------------------------------
   CART DRAWER
----------------------------------------- */
const menuOpen = ref(false)
</script>

<template>
  <BrandThemeUpdater />

  <v-app class="bg-background text-text">

    <!-- HEADER (maintenance alatt csak adminnak) -->
  <MyHeader
    v-if="layoutMode === 'default' || layoutMode === 'maintenance'"
    :mode="headerMode"
    :layout="layoutMode"
  />

    <!-- CART DRAWER (adminnak nincs) -->
    <CartDrawer
      v-if="headerMode !== 'admin' && layoutMode === 'default'"
    />

    <!-- MAIN CONTENT -->
    <v-main class="bg-background text-text">
      <slot />
    </v-main>

    <!-- COOKIE BANNER -->
    <CookieBanner />

    <!-- FOOTER (maintenance alatt csak adminnak) -->
    <MyFooter v-if="layoutMode === 'default'" />

  </v-app>
</template>

<style>
html {
  scroll-behavior: smooth;
}
html, body, .v-application, .v-application__wrap {
  background-color: var(--background) !important;
  color: var(--text) !important;
  font-family: var(--font-family) !important;
}
</style>
