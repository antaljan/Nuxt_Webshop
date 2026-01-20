<script setup>
import GenericHeroSection from '@/components/GenericHeroSection.vue'
import GenericImageTextSection from '@/components/GenericImageTextSection.vue'
import SectionSeparator from '@/components/sectionSeparator.vue'
import GenericTextSection from '~/components/GenericTextSection.vue'
import GenericFeedbackSection from '~/components/GenericFeedbackSection.vue'
import GenericContactSection from '~/components/GenericContactSection.vue'
import GenericBlogSection from '~/components/GenericBlogSection.vue'
import { watch } from 'vue'
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
// Story (GenericTextSection)
const story = await useAsyncData(
  () => `content-story-${locale.value}`,
  () => $fetch(`/api/content/story/${locale.value}`)
)
// Methode (GenericTextSection)
const methode = await useAsyncData(
  () => `content-methode-${locale.value}`,
  () => $fetch(`/api/content/methode/${locale.value}`)
)
// Feedback (GenericFeedbackSection) - nincs dinamikus tartalom
const feedback = null
// Contact (GenericContactSection) 
const contact = await useAsyncData(
  () => `content-contact-${locale.value}`,
  () => $fetch(`/api/content/contact/${locale.value}`)
)
// CONTACT HERO – külön kulcs, külön endpoint
const contactHero = await useAsyncData(
  () => `content-contact-hero-${locale.value}`,
  () => $fetch(`/api/content/contact-hero/${locale.value}`)
)

// Nyelvváltás figyelése
watch(locale, () => {
  hero.refresh()
  about.refresh()
  story.refresh()
  methode.refresh()
  contact.refresh()
  contactHero.refresh()
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
  <GenericFeedbackSection />
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
  <GenericBlogSection />
</template>
