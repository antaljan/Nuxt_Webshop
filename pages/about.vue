<script setup>
import GenericHeroSection from '@/components/GenericHeroSection.vue'
import GenericImageTextSection from '@/components/GenericImageTextSection.vue'
import GenericHtmlTextSection from '~/components/GenericHtmlTextSection.vue'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

/* ---------------------------
   AUTH + BRAND
--------------------------- */
const { user, fetchUser, isAdmin } = useAuth()
const { settings: brand, loadBrand } = useBrand()

// Ezzel biztosítjuk, hogy a szerver tudja, ki vagy, MIELŐTT a template renderelődne
if (process.server || !user.value) {
  await Promise.all([
    fetchUser(),
    loadBrand()
  ])
}
const commingSoon = await useAsyncData(
  () => `content-commingSoon-${locale.value}`,
  () => $fetch(`/api/content/commingSoon/${locale.value}`)
)
// ABOUT Full (GenericImageTextSection)
const about_full = await useAsyncData(
  () => `content-about_full-${locale.value}`,
  () => $fetch(`/api/content/about_full/${locale.value}`)
)
// CV (GenericHtmlTextSection)
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
    <!-- MAINTENANCE MODE -->
  <GenericHeroSection
    v-if="brand?.maintenanceMode && !isAdmin"
    :content="commingSoon?.data?.value"
    sectionKey="commingSoon"
  />

  <!-- NORMAL PAGE -->
  <template v-else>

    <GenericImageTextSection
      v-if="about_full?.data?.value"
      :content="about_full.data.value"
      sectionKey="about_full"
      :reverse="false"
    />

    <GenericHtmlTextSection
      v-if="cv?.data?.value"
      :content="cv.data.value"
      sectionKey="cv"
    />
  </template>

</template>
