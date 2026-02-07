<script setup>
import { ref } from 'vue'
import MyHeader from '~/components/MyHeader.vue'
import MyFooter from '~/components/MyFooter.vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
import CartDrawer from '~/components/CartDrawer.vue'
import { useBrand } from '@/composables/useBrand'
import BrandCssVars from '@/components/BrandCssVars.vue'

const menuOpen = ref(false)
const { isAdmin, loggedIn } = useAuth()
const { t } = useI18n()

// brand settings
const { settings, loadBrand } = useBrand();
await loadBrand();

/* -----------------------------------------
   MAIN MENU (hash + route keverve)
----------------------------------------- */
const mainMenu = [
  { type: 'hash', to: '/#hero', label: 'menu.home' },
  { type: 'hash', to: '/#about', label: 'menu.about' },
  { type: 'hash', to: '/#story', label: 'menu.story' },
  { type: 'hash', to: '/#methode', label: 'menu.methode' },
  { type: 'hash', to: '/#contact', label: 'menu.contact' },

  { type: 'route', to: '/blog', label: 'menu.blog', icon: 'mdi-book-open-page-variant' },
  { type: 'route', to: '/products', label: 'menu.products', icon: 'mdi-medical-bag' }
]

/* -----------------------------------------
   User MENU
----------------------------------------- */
const userMenu = [
  { to: '/user', label: 'user.dashboard' },
  { to: '/user/profile', label: 'user.profile' },
  { to: '/user/products', label: 'user.products' }
]

/* -----------------------------------------
   ADMIN MENU
----------------------------------------- */
const adminMenu = [
  { to: '/admin', label: 'admin.dashboard' },
  { to: '/admin/cibersecu', label: 'admin.cibersecu' },
  { to: '/admin/blog', label: 'admin.Posts' },
  { to: '/admin/users', label: 'admin.users.title' },
  { to: '/admin/newsletter', label: 'admin.newsletter.title' },
  { to: '/admin/products', label: 'admin.products.menu' },
  { to: '/admin/coaching', label: 'admin.coaching.menu' },
  { to: '/admin/brand', label: 'admin.brand.menu' },
  { to: '/admin/images', label: 'admin.images' }
]

const closeMenu = () => (menuOpen.value = false)
</script>

<template>
  <v-app>
    <BrandCssVars />
    <!-- HEADER -->
    <MyHeader @toggle-menu="menuOpen = !menuOpen" />
    <!-- CART DRAWER (MINDEN OLDALON ELÉRHETŐ) -->
    <CartDrawer />
    <!-- MOBILE DRAWER -->
    <client-only>
    <v-navigation-drawer
      v-model="menuOpen"
      location="start"
      mode="temporary"
      width="280"
    >
      <v-list>

        <!-- MAIN MENU -->
        <v-list-item
          v-for="item in mainMenu"
          :key="item.label"
          @click="closeMenu"
        >
          <!-- ROUTE LINK -->
          <template v-if="item.type === 'route'">
            <NuxtLink :to="item.to" class="flex items-center w-full py-2">
              <v-icon v-if="item.icon" class="mr-2">{{ item.icon }}</v-icon>
              {{ t(item.label) }}
            </NuxtLink>
          </template>

          <!-- HASH LINK -->
          <template v-else>
            <NuxtLink :to="item.to" class="flex items-center w-full py-2">
              {{ t(item.label) }}
            </NuxtLink>
          </template>
        </v-list-item>

        <!-- User SECTION -->
        <template v-if="loggedIn">
          <v-divider class="my-2" />
          <v-list-item
            v-for="item in userMenu"
            :key="item.to"
            @click="closeMenu"
          >
            <NuxtLink :to="item.to" class="w-full block py-2">
              {{ t(item.label) }}
            </NuxtLink>
          </v-list-item>
        </template>

        <!-- ADMIN SECTION -->
        <template v-if="isAdmin">
          <v-divider class="my-2" />
          <p class="px-4 py-2 font-bold text-lg">{{ t('admin.adminSection') }}</p>
          <v-list-item
            v-for="item in adminMenu"
            :key="item.to"
            @click="closeMenu"
          >
            <NuxtLink :to="item.to" class="w-full block py-2">
              {{ t(item.label) }}
            </NuxtLink>
          </v-list-item>
        </template>

      </v-list>
    </v-navigation-drawer>
    </client-only>

    <!-- MAIN CONTENT -->
    <v-main>
      <slot />
    </v-main>

    <!-- FOOTER -->
    <MyFooter />

  </v-app>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
