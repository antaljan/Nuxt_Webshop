<script setup>
import GenericHeroSection from '@/components/GenericHeroSection.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// HERO
const hero = await useAsyncData(
  () => `content-hero-${locale.value}`,
  () => $fetch(`/api/content/hero/${locale.value}`)
)

// Nyelvváltás figyelése
watch(locale, () => {
  hero.refresh()
})
</script>

<template>
  <GenericHeroSection
    v-if="hero?.data?.value"
    :content="hero.data.value"
  />
</template>
