<template>
  <v-app-bar flat color="white" class="border-b">
    <!-- ALWAYS VISIBLE HAMBURGER -->
    <v-app-bar-nav-icon @click="$emit('toggle-menu')" />

    <!-- customer cart -->

    <v-btn icon @click="openCart">
      <v-badge
        :content="cart.length"
        color="red"
        v-if="cart.length > 0"
      >
        <v-icon>mdi-cart</v-icon>
      </v-badge>
      <v-icon v-else>mdi-cart-outline</v-icon>
    </v-btn>

    <v-spacer />

    <!-- LANGUAGE SWITCH -->
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


    <!-- LOGIN / LOGOUT -->
    <v-btn variant="text" @click="onLoginLogout">
      <v-icon v-if="loggedIn">mdi-logout</v-icon>
      <v-icon v-else>mdi-login</v-icon>
      <span class="ml-2">
        {{ loggedIn ? user?.name : $t('header.login') }}
      </span>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useProducts } from '~/composables/useProducts'
import { useCartDrawer } from '~/composables/useCartDrawer'
// NE importáld a vue-i18n-t manuálisan!
const { locale, setLocale, locales } = useI18n()
const { user, loggedIn, logout } = useAuth()

// Alakítsuk át a locales tömböt a Vuetify számára
const languages = computed(() => 
  locales.value.map(l => ({
    title: l.code.toUpperCase(),
    value: l.code
  }))
)

const onLoginLogout = async () => {
  if (loggedIn.value) {
    await logout()
    // Kijelentkezés után maradjon ugyanott
    return
  }

  // Bejelentkezés → átirányítás a login oldalra, de megőrizzük a jelenlegi route-ot
  const current = useRoute().fullPath
  navigateTo(`/login?redirect=${encodeURIComponent(current)}`)
}

// Cart drawer kezelése
const { cart } = useProducts()
const { isOpen } = useCartDrawer()
function openCart() {
  isOpen.value = true
}

</script>


<style>
.border-b {
  border-bottom: 1px solid #ddd;
}
</style>
