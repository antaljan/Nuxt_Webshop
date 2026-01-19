<template>
  <v-app-bar flat color="white" class="border-b">
    <v-app-bar-nav-icon @click="menuOpen = !menuOpen"/>
    <v-spacer />
    <v-toolbar-title>Antali Gyöngyi Edit</v-toolbar-title>
    <v-navigation-drawer app v-model="menuOpen" clipped>
      <v-list>
        <v-list-item to="/#home" @click="menuOpen = !menuOpen">1...{{ $t('menu.home') }}</v-list-item>
        <v-list-item to="/#about" @click="menuOpen = !menuOpen">2...{{ $t('menu.about') }}</v-list-item>
        <v-list-item to="/#story" @click="menuOpen = !menuOpen">3...{{ $t('menu.story') }}</v-list-item>
        <v-list-item to="/#methode" @click="menuOpen = !menuOpen">4...{{ $t('menu.methode') }}</v-list-item>
        <v-list-item to="/#contact" @click="menuOpen = !menuOpen">5...{{ $t('menu.contact') }}</v-list-item>
        <v-list-item to="/#blog" @click="menuOpen = !menuOpen">6...{{ $t('menu.blog') }}</v-list-item>
        <div v-if="isAdmin">
          <v-divider class="my-2" />
          <v-list-item to="/admin/blog/create" @click="menuOpen = !menuOpen">{{ $t('admin.newPost') }}</v-list-item>
          <v-list-item to="/admin/users" @click="menuOpen = !menuOpen">{{ $t('admin.users') }}</v-list-item>
          <v-list-item to="/admin/newsletter" @click="menuOpen = !menuOpen">{{ $t('admin.newsletter') }}</v-list-item>
          <v-list-item to="/admin/stat" @click="menuOpen = !menuOpen">{{ $t('admin.statistics') }}</v-list-item>
          <v-list-item to="/admin/products" @click="menuOpen = !menuOpen">{{ $t('admin.products') }}</v-list-item>
          <v-list-item to="/admin/images" @click="menuOpen = !menuOpen">{{ $t('admin.images') }}</v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-spacer />
    <v-select
      v-model="locale"
      :items="languages"
      density="compact"
      hide-details
      class="w-20 mr-4"
    />
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
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

/* ---------------------------
   AUTH
--------------------------- */
const { user, loggedIn, isAdmin, logout } = useAuth()

/* ---------------------------
   RESPONSIVE BREAKPOINTS
--------------------------- */
const { smAndDown, mdAndUp } = useDisplay()

/* ---------------------------
   MOBILE MENU
--------------------------- */
const menuOpen = ref(false)
const closeMenu = () => (menuOpen.value = false)

/* ---------------------------
   I18N LANGUAGE SWITCH
--------------------------- */
const { locale } = useI18n()
const languages = ['en', 'hu', 'de']

/* ---------------------------
   LOGIN / LOGOUT
--------------------------- */
const onLoginLogout = async () => {
  if (loggedIn.value) {
    await logout()
    navigateTo('/')
  } else {
    navigateTo('/login')
  }
}
</script>

<style scoped>
.menu-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}
.menu-link:hover {
  color: #000;
}
.border-b {
  border-bottom: 1px solid #ddd;
}
</style>
