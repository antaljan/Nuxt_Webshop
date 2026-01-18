<script setup>
import MyHeader from '~/components/MyHeader.vue'
import MyFooter from '~/components/MyFooter.vue'
import { useAuth } from '~/composables/useAuth'
const { user } = useAuth()
</script>

<template>
  <v-app>
    <MyHeader />

    <v-main class="bg-gray-50 py-6">
      <slot />
    </v-main>

    <MyFooter />
  </v-app>
</template>
