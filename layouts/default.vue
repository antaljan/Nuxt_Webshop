<script setup>
import { ref } from 'vue'
import MyHeader from '~/components/MyHeader.vue'
import MyFooter from '~/components/MyFooter.vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

const menuOpen = ref(false)
const { isAdmin } = useAuth()
const { t } = useI18n()

const mainMenu = [
  { to: '/#home', label: 'menu.home' },
  { to: '/#about', label: 'menu.about' },
  { to: '/#story', label: 'menu.story' },
  { to: '/#methode', label: 'menu.methode' },
  { to: '/#contact', label: 'menu.contact' },
  { to: '/#blog', label: 'menu.blog' }
]

const adminMenu = [
  { to: '/admin/blog/create', label: 'admin.newPost' },
  { to: '/admin/users', label: 'admin.users' },
  { to: '/admin/newsletter', label: 'admin.newsletter' },
  { to: '/admin/stat', label: 'admin.statistics' },
  { to: '/admin/products', label: 'admin.products' },
  { to: '/admin/images', label: 'admin.images' }
]

const closeMenu = () => (menuOpen.value = false)
</script>

<template>
  <v-app>
    <!-- HEADER -->
    <MyHeader @toggle-menu="menuOpen = !menuOpen" />

    <!-- DRAWER – NEM az app-bar-ben, hanem KÍVÜL -->
    <v-navigation-drawer
      v-model="menuOpen"
      location="start"
      mode="temporary"
      width="280"
    >
      <v-list>
        <v-list-item
          v-for="item in mainMenu"
          :key="item.to"
          :to="item.to"
          @click="closeMenu"
        >
          {{ t(item.label) }}
        </v-list-item>

        <template v-if="isAdmin">
          <v-divider class="my-2" />
          <v-list-item
            v-for="item in adminMenu"
            :key="item.to"
            :to="item.to"
            @click="closeMenu"
          >
            {{ t(item.label) }}
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- MAIN CONTENT -->
    <v-main>
      <slot />
    </v-main>

    <MyFooter />
  </v-app>
</template>
