<script setup lang="ts">
import MyHeader from '~/components/MyHeader.vue'
import MyFooter from '~/components/MyFooter.vue'
import CookieBanner from '~/components/CookieBanner.vue'
import BrandThemeUpdater from '~/components/BrandThemeUpdater.vue'

import { useAuth } from '@/composables/useAuth'
import { useBrand } from '@/composables/useBrand'

const { settings, loadBrand } = useBrand()
const { user, loggedIn, isAdmin, fetchUser } = useAuth()

if (process.server || !settings.value) {
  await Promise.all([
    loadBrand(),
    !user.value ? fetchUser() : Promise.resolve()
  ])
}
</script>

<template>
  <BrandThemeUpdater />

  <v-app class="bg-background text-text">

    <!-- HEADER: lead layout -->
    <MyHeader
      :mode="isAdmin ? 'admin' : (loggedIn ? 'user' : 'visitor')"
      layout="lead"
    />

    <v-main>
      <slot />
    </v-main>

    <CookieBanner />
    <MyFooter />
  </v-app>
</template>
