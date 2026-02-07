<script setup>
import { watchEffect } from 'vue'
import { useBrand } from '@/composables/useBrand'

const { settings } = useBrand()

watchEffect(() => {
  if (!settings.value) return

  const root = document.documentElement

  root.style.setProperty('--primary', settings.value.primaryColor || '#673fff')
  root.style.setProperty('--background', settings.value.backgroundColor || '#ffffff')
  root.style.setProperty('--text', settings.value.textColor || '#222222')
  root.style.setProperty('--accent', settings.value.accentColor || '#8566ff')
  root.style.setProperty('--font-family', settings.value.fontFamily || 'Roboto')
})
</script>

<template>
  <div style="display:none"></div>
</template>
