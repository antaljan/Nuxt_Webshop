<script setup>
import GenericHeroSection from '@/components/GenericHeroSection.vue'
import GenericImageTextSection from '@/components/GenericImageTextSection.vue'
import SectionSeparator from '@/components/sectionSeparator.vue'
import GenericTextSection from '~/components/GenericTextSection.vue'
import GenericFeedbackSection from '~/components/GenericFeedbackSection.vue'
import GenericContactSection from '~/components/GenericContactSection.vue'
import GenericBlogSection from '~/components/GenericBlogSection.vue'

import { watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useBrand } from '@/composables/useBrand'

const { locale } = useI18n()

/* ---------------------------
   AUTH + BRAND
--------------------------- */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

const { settings: brand, loadBrand } = useBrand()
await loadBrand()

/* ---------------------------
   CONTENT LOADING
--------------------------- */
const commingSoon = await useAsyncData(
  () => `content-commingSoon-${locale.value}`,
  () => $fetch(`/api/content/commingSoon/${locale.value}`)
)

const hero = await useAsyncData(
  () => `content-hero-${locale.value}`,
  () => $fetch(`/api/content/hero/${locale.value}`)
)

const about = await useAsyncData(
  () => `content-about-${locale.value}`,
  () => $fetch(`/api/content/about/${locale.value}`)
)

const story = await useAsyncData(
  () => `content-story-${locale.value}`,
  () => $fetch(`/api/content/story/${locale.value}`)
)

const methode = await useAsyncData(
  () => `content-methode-${locale.value}`,
  () => $fetch(`/api/content/methode/${locale.value}`)
)

const contact = await useAsyncData(
  () => `content-contact-${locale.value}`,
  () => $fetch(`/api/content/contact/${locale.value}`)
)

const contactHero = await useAsyncData(
  () => `content-contact-hero-${locale.value}`,
  () => $fetch(`/api/content/contact-hero/${locale.value}`)
)

/* ---------------------------
   LANGUAGE WATCHER
--------------------------- */
watch(locale, () => {
  commingSoon.refresh()
  hero.refresh()
  about.refresh()
  story.refresh()
  methode.refresh()
  contact.refresh()
  contactHero.refresh()
})
</script>

<template>

  <!-- MAINTENANCE MODE -->
  <GenericHeroSection
    v-if="brand?.maintenanceMode && !isAdmin"
    :content="commingSoon?.data?.value"
    sectionKey="commingSoon"
  />

  <!-- NORMAL LANDING PAGE -->
  <template v-else>

    <GenericHeroSection
      v-if="hero?.data?.value"
      :content="hero.data.value"
      sectionKey="hero"
    />

    <GenericImageTextSection
      v-if="about?.data?.value"
      :content="about.data.value"
      sectionKey="about"
      :reverse="false"
    />

    <section-separator />

    <GenericTextSection
      v-if="story?.data?.value"
      :content="story.data.value"
      sectionKey="story"
    />

    <section-separator />

    <GenericTextSection
      v-if="methode?.data?.value"
      :content="methode.data.value"
      sectionKey="methode"
    />

    <section-separator />

    <GenericFeedbackSection sectionKey="feedback" />

    <GenericHeroSection
      v-if="contactHero?.data?.value"
      :content="contactHero.data.value"
      sectionKey="contact-hero"
    />

    <GenericContactSection
      v-if="contact?.data?.value"
      :content="contact.data.value"
      sectionKey="contact"
    />

    <GenericBlogSection sectionKey="blog" />

  </template>

</template>
