<template>
  <v-app-bar flat color="white" class="border-b">

    <!-- Mobile menu icon -->
    <v-app-bar-nav-icon
      v-if="smAndDown"
      @click="menuOpen = true"
    />

    <!-- Logo -->
    <NuxtLink to="/" class="text-xl font-semibold ml-2">
      Antali Gyöngyi Edit
    </NuxtLink>

    <!-- Desktop menu -->
    <div v-if="mdAndUp" class="flex gap-6 ml-10">
      <NuxtLink to="/#home" class="menu-link">{{ $t('menu.home') }}</NuxtLink>
      <NuxtLink to="/#about" class="menu-link">{{ $t('menu.about') }}</NuxtLink>
      <NuxtLink to="/#story" class="menu-link">{{ $t('menu.story') }}</NuxtLink>
      <NuxtLink to="/#methode" class="menu-link">{{ $t('menu.methode') }}</NuxtLink>
      <NuxtLink to="/#contact" class="menu-link">{{ $t('menu.contact') }}</NuxtLink>
      <NuxtLink to="/#blog" class="menu-link">{{ $t('menu.blog') }}</NuxtLink>

      <!-- Admin desktop menu -->
      <template v-if="isAdmin">
        <NuxtLink to="/admin/blog/create" class="menu-link">{{ $t('admin.newPost') }}</NuxtLink>
        <NuxtLink to="/admin/users" class="menu-link">{{ $t('admin.users') }}</NuxtLink>
        <NuxtLink to="/admin/newsletter" class="menu-link">{{ $t('admin.newsletter') }}</NuxtLink>
        <NuxtLink to="/admin/stat" class="menu-link">{{ $t('admin.statistics') }}</NuxtLink>
        <NuxtLink to="/admin/products" class="menu-link">{{ $t('admin.products') }}</NuxtLink>
        <NuxtLink to="/admin/images" class="menu-link">{{ $t('admin.images') }}</NuxtLink>
      </template>
    </div>

    <v-spacer />

    <!-- Language selector -->
    <v-select
      v-model="locale"
      :items="languages"
      density="compact"
      hide-details
      class="w-20 mr-4"
    />

    <!-- Login / Logout -->
    <v-btn variant="text" @click="onLoginLogout">
      <v-icon v-if="loggedIn">mdi-logout</v-icon>
      <v-icon v-else>mdi-login</v-icon>
      <span class="ml-2">
        {{ loggedIn ? user?.name : $t('header.login') }}
      </span>
    </v-btn>

    <!-- Mobile drawer -->
    <v-navigation-drawer v-model="menuOpen" temporary location="left">
      <v-list>
        <v-list-item to="/#home" @click="closeMenu">{{ $t('menu.home') }}</v-list-item>
        <v-list-item to="/#about" @click="closeMenu">{{ $t('menu.about') }}</v-list-item>
        <v-list-item to="/#story" @click="closeMenu">{{ $t('menu.story') }}</v-list-item>
        <v-list-item to="/#methode" @click="closeMenu">{{ $t('menu.methode') }}</v-list-item>
        <v-list-item to="/#contact" @click="closeMenu">{{ $t('menu.contact') }}</v-list-item>
        <v-list-item to="/#blog" @click="closeMenu">{{ $t('menu.blog') }}</v-list-item>

        <template v-if="isAdmin">
          <v-divider class="my-2" />
          <v-list-item to="/admin/blog/create" @click="closeMenu">{{ $t('admin.newPost') }}</v-list-item>
          <v-list-item to="/admin/users" @click="closeMenu">{{ $t('admin.users') }}</v-list-item>
          <v-list-item to="/admin/newsletter" @click="closeMenu">{{ $t('admin.newsletter') }}</v-list-item>
          <v-list-item to="/admin/stat" @click="closeMenu">{{ $t('admin.statistics') }}</v-list-item>
          <v-list-item to="/admin/products" @click="closeMenu">{{ $t('admin.products') }}</v-list-item>
          <v-list-item to="/admin/images" @click="closeMenu">{{ $t('admin.images') }}</v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

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
