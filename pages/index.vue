<script setup>
import GenericHeroSection from '@/components/GenericHeroSection.vue'
import GenericImageTextSection from '@/components/GenericImageTextSection.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// HERO
const hero = await useAsyncData(
  () => `content-hero-${locale.value}`,
  () => $fetch(`/api/content/hero/${locale.value}`)
)
// ABOUT (GenericImageTextSection)
const about = await useAsyncData(
  () => `content-about-${locale.value}`,
  () => $fetch(`/api/content/about/${locale.value}`)
)

// Nyelvváltás figyelése
watch(locale, () => {
  hero.refresh()
  about.refresh()
})
</script>

<template>
  <GenericHeroSection
    v-if="hero?.data?.value"
    :content="hero.data.value"
  />

  <GenericImageTextSection
    v-if="about?.data?.value"
    :content="about.data.value"
    sectionKey="about"
    :reverse="false"
  />

</template>
