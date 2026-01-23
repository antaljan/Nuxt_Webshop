<!-- app/pages/index.vue -->
<template>
  <div>
    <h1>User oldal</h1>
    <p>itt lesz a felhasználói tartalom</p>
  </div>
</template>
<script setup>
import { useAuth } from '~/composables/useAuth'
const { loggedIn } = useAuth()
import { onMounted } from 'vue'

// Client site guard
onMounted(() => {
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
</script>
