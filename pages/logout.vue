<template>
  <div class="flex h-screen items-center justify-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
</template>
<script setup>
    const { logout } = useAuth()
    await logout()
    navigateTo('/')
</script>