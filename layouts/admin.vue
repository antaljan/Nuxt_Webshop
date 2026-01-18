<script setup>
import MyHeader from '~/components/MyHeader.vue'
import MyFooter from '~/components/MyFooter.vue'
import { useAuth } from '~/composables/useAuth'
const { user } = useAuth()
</script>

<template>
  <v-app>
    <MyHeader />

    <div class="flex">
      <!-- Admin sidebar -->
      <aside class="w-64 bg-gray-100 border-r p-4">
        <nav class="flex flex-col gap-2">
          <NuxtLink to="/admin">Dashboard</NuxtLink>
          <NuxtLink to="/admin/blog">Blog</NuxtLink>
          <NuxtLink to="/admin/products">Products</NuxtLink>
          <NuxtLink to="/admin/content">Content</NuxtLink>
          <NuxtLink to="/admin/newsletter">Newsletter</NuxtLink>
          <NuxtLink to="/admin/users">Users</NuxtLink>
          <NuxtLink to="/admin/stat">Statistics</NuxtLink>
        </nav>
      </aside>

      <v-main class="p-6">
        <slot />
      </v-main>
    </div>

    <MyFooter />
  </v-app>
</template>
