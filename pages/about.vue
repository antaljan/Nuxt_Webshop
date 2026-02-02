<script setup>
import GenericImageTextSection from '@/components/GenericImageTextSection.vue'
import GenericTextSection from '~/components/GenericTextSection.vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// ABOUT Full (GenericImageTextSection)
const about_full = await useAsyncData(
  () => `content-about_full-${locale.value}`,
  () => $fetch(`/api/content/about_full/${locale.value}`)
)
// CV (GenericTextSection)
const cv = await useAsyncData(
  () => `content-cv-${locale.value}`,
  () => $fetch(`/api/content/cv/${locale.value}`)
)

// Nyelvváltás figyelése
watch(locale, () => {
  about_full.refresh()
  cv.refresh()
})

</script>

<template>

  <GenericImageTextSection
    v-if="about_full?.data?.value"
    :content="about_full.data.value"
    sectionKey="about_full"
    :reverse="false"
  />

  <GenericTextSection
    v-if="cv?.data?.value"
    :content="cv.data.value"
    sectionKey="cv"
  />

</template>
