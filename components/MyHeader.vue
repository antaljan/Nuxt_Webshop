<template>
  <header class="header">
    <!-- Left: Mobile menu toggle -->
    <button class="menu-btn" @click="toggleMenu">
      <v-icon>mdi-menu</v-icon>
    </button>

    <!-- Center: Logo -->
    <NuxtLink to="/" class="logo">
      Clima Coaching
    </NuxtLink>

    <!-- Right: Language + Login -->
    <div class="right-side">
      <select v-model="lang" @change="changeLanguage" class="lang-select">
        <option value="en">EN</option>
        <option value="hu">HU</option>
        <option value="de">DE</option>
      </select>

      <v-btn
        variant="text"
        @click="onLoginLogout"
        class="login-btn"
      >
        <v-icon v-if="loggedIn">mdi-logout</v-icon>
        <v-icon v-else>mdi-login</v-icon>
        <span class="ml-2">
          {{ loggedIn ? user?.name : 'Login' }}
        </span>
      </v-btn>
    </div>

    <!-- Mobile menu -->
    <nav v-if="menuOpen" class="mobile-menu">
      <NuxtLink to="/#home" @click="closeMenu">Home</NuxtLink>
      <NuxtLink to="/#about" @click="closeMenu">About</NuxtLink>
      <NuxtLink to="/#story" @click="closeMenu">Story</NuxtLink>
      <NuxtLink to="/#methode" @click="closeMenu">Methode</NuxtLink>
      <NuxtLink to="/#contact" @click="closeMenu">Contact</NuxtLink>
      <NuxtLink to="/#blog" @click="closeMenu">Blog</NuxtLink>

      <!-- Admin menu -->
      <template v-if="user?.role === 'admin'">
        <NuxtLink to="/newblog" @click="closeMenu">New Post</NuxtLink>
        <NuxtLink to="/users" @click="closeMenu">Users</NuxtLink>
        <NuxtLink to="/newsletter" @click="closeMenu">Newsletter</NuxtLink>
        <NuxtLink to="/admin/statistics" @click="closeMenu">Statistics</NuxtLink>
        <NuxtLink to="/productOverView" @click="closeMenu">Products</NuxtLink>
        <NuxtLink to="/booking" @click="closeMenu">Booking</NuxtLink>
        <NuxtLink to="/admin/ImagesLibrary" @click="closeMenu">Images</NuxtLink>
      </template>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'

/* ---------------------------
   AUTH
--------------------------- */
const { user, loggedIn, logout } = useAuth()

/* ---------------------------
   MENU STATE
--------------------------- */
const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const closeMenu = () => (menuOpen.value = false)

/* ---------------------------
   LANGUAGE
--------------------------- */
const lang = ref('hu')

if (process.client) {
  lang.value = document.documentElement.lang || 'hu'
}

if (process.client) {
  watch(lang, (val) => {
    document.documentElement.lang = val
  })
}


const changeLanguage = () => {
  if (process.client) {
    document.documentElement.lang = lang.value
  }
}


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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #ddd;
}

.menu-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  color: black;
}

.right-side {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-select {
  padding: 4px 8px;
}

.login-btn {
  display: flex;
  align-items: center;
}

.mobile-menu {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.mobile-menu a {
  padding: 12px;
  text-decoration: none;
  color: black;
  border-bottom: 1px solid #eee;
}
</style>
