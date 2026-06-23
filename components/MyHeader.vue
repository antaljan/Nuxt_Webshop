<template>
  <v-app-bar
    flat
    color="background"
    class="border-b border-text/15 text-text"
  >

    <!-- -----------------------------------------
         DEFAULT LAYOUT: FELSŐ MENÜ
         (maintenance alatt csak admin)
    ----------------------------------------- -->
    <template v-if="layout === 'default'">
      <!-- MAIN NAV -->
      <div class="flex items-center gap-6">

        <!-- HOME -->
        <NuxtLink to="/" class="hover:text-primary">
          {{ t('menu.home') }}
        </NuxtLink>

        <!-- BLOG -->
        <NuxtLink to="/blog" class="hover:text-primary">
          {{ t('menu.blog') }}
        </NuxtLink>

        <!-- SHOP -->
        <NuxtLink to="/products" class="hover:text-primary">
          {{ t('menu.products') }}
        </NuxtLink>

        <!-- MY ACCOUNT (user/admin) -->
        <NuxtLink
          v-if="mode !== 'visitor'"
          :to="mode === 'admin' ? '/admin' : '/user'"
          class="hover:text-primary"
        >
          {{ t('header.myAccount') }}
        </NuxtLink>
      </div>
    </template>

    <!-- -----------------------------------------
         LEAD LAYOUT:
         nincs felső menü, csak login + language
    ----------------------------------------- -->
    <template v-if="layout === 'lead'">
      <div class="text-lg font-semibold">
        <!-- üres hely a bal oldalon, hogy a jobb oldali ikonok ne ugorjanak -->
      </div>
    </template>

    <!-- -----------------------------------------
         MAINTENANCE:
         csak admin lát menüt
    ----------------------------------------- -->
    <template v-if="layout === 'maintenance' && mode === 'admin'">
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="hover:text-primary">
          {{ t('menu.home') }}
        </NuxtLink>
        <NuxtLink to="/blog" class="hover:text-primary">
          {{ t('menu.blog') }}
        </NuxtLink>
        <NuxtLink to="/products" class="hover:text-primary">
          {{ t('menu.products') }}
        </NuxtLink>
        <NuxtLink to="/admin" class="hover:text-primary">
          {{ t('header.myAccount') }}
        </NuxtLink>
      </div>
    </template>

    <v-spacer />

    <!-- -----------------------------------------
         CART ICON (csak user + visitor, default layout)
    ----------------------------------------- -->
    <v-btn
      v-if="layout === 'default' && mode !== 'admin'"
      icon
      @click="openCart"
    >
      <v-badge
        :content="cart.length"
        color="red"
        v-if="cart.length > 0"
      >
        <v-icon>mdi-cart</v-icon>
      </v-badge>
      <v-icon v-else>mdi-cart-outline</v-icon>
    </v-btn>

    <!-- -----------------------------------------
         LANGUAGE SWITCH
    ----------------------------------------- -->
    <v-select
      :model-value="locale"
      :items="languages"
      @update:model-value="setLocale($event)"
      density="compact"
      hide-details
      class="mx-4"
      style="max-width: 100px"
      item-title="title"
      item-value="value"
    />

    <!-- -----------------------------------------
         LOGIN / LOGOUT (mindig látszik)
    ----------------------------------------- -->
    <v-btn variant="text" @click="onLoginLogout">
      <v-icon v-if="loggedIn">mdi-logout</v-icon>
      <v-icon v-else>mdi-login</v-icon>
      <span class="ml-2">
        {{ loggedIn ? user?.name : t('header.login') }}
      </span>
    </v-btn>

  </v-app-bar>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useProducts } from '@/composables/useProducts'
import { useCartDrawer } from '@/composables/useCartDrawer'
import { computed } from 'vue'

/* -----------------------------------------
   PROPS
----------------------------------------- */
const props = defineProps({
  mode: { type: String, default: 'visitor' },     // admin | user | visitor
  layout: { type: String, default: 'default' }    // default | lead | maintenance
})

/* -----------------------------------------
   I18N
----------------------------------------- */
const { t, locale, setLocale, locales } = useI18n()

const languages = computed(() =>
  locales.value.map(l => ({
    title: l.code.toUpperCase(),
    value: l.code
  }))
)

/* -----------------------------------------
   AUTH
----------------------------------------- */
const { user, loggedIn, logout } = useAuth()

const onLoginLogout = async () => {
  if (loggedIn.value) {
    await logout()
    return
  }
  const current = useRoute().fullPath
  navigateTo(`/login?redirect=${encodeURIComponent(current)}`)
}

/* -----------------------------------------
   CART
----------------------------------------- */
const { cart } = useProducts()
const { isOpen } = useCartDrawer()

function openCart() {
  isOpen.value = true
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
