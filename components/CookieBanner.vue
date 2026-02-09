<template>
  <transition name="fade">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 bg-background text-text shadow-lg p-6 z-50 border-t border-gray-300"
    >
      <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <!-- TEXT -->
        <p class="text-sm leading-snug">
          {{ $t('cookie.message') }}
          <NuxtLink to="/cookie" class="text-primary underline ml-1">
            {{ $t('cookie.more') }}
          </NuxtLink>
        </p>

        <!-- BUTTON -->
        <v-btn color="primary" @click="acceptCookies">
          {{ $t('cookie.accept') }}
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showBanner = ref(false)

onMounted(() => {
  const accepted = localStorage.getItem('cookieAccepted')
  if (!accepted) {
    showBanner.value = true
  }
})

function acceptCookies() {
  localStorage.setItem('cookieAccepted', 'true')
  showBanner.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
