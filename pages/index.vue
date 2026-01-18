<template>

  <!-- HERO -->
  <GenericHeroSection
    v-if="hero?.data?.value"
    :content="hero.data.value"
  />

  <!-- ABOUT 
  <GenericImageTextSection v-if="about?.data" :content="about.data" />
  <sectionSeparator />

   -- STORY --
  <GenericTextSection v-if="story?.data" :content="story.data" />
  <sectionSeparator />

  -- METHODE --
  <GenericTextSection v-if="methode?.data" :content="methode.data" />
  <sectionSeparator />

  -- FEEDBACK --
  <GenericFeedbackSection />
  <sectionSeparator />

  -- CONTACT --
  <GenericHeroSection v-if="contact?.data" :content="contact.data" />
  <GenericContactSection v-if="contact?.data" :content="contact.data" />
  <sectionSeparator />

  -- BLOG --
  <blogSection />
   -->

</template>

<script setup>
import { ref, watch } from 'vue'
import GenericHeroSection from '@/components/GenericHeroSection.vue'
//import GenericImageTextSection from '@/components/GenericImageTextSection.vue'
//import GenericTextSection from '@/components/GenericTextSection.vue'
//import GenericFeedbackSection from '@/components/GenericFeedbackSection.vue'
//import GenericContactSection from '@/components/GenericContactSection.vue'
//import sectionSeparator from '@/components/sectionSeparator.vue'
//import blogSection from '@/components/blogSection.vue'

const lang = ref(
  process.client ? document.documentElement.lang || 'hu' : 'hu'
)

// HERO
const hero = await useAsyncData(
  () => `content-hero-${lang.value}`,
  () => $fetch(`/api/content/hero/${lang.value}`),
  { staleTime: 1000 * 60 * 5 }
)
/*
// ABOUT
const about = await useAsyncData(
  () => `content-about-${lang.value}`,
  () => $fetch(`/api/content/about/${lang.value}`),
  { staleTime: 1000 * 60 * 5 }
)

// STORY
const story = await useAsyncData(
  () => `content-story-${lang.value}`,
  () => $fetch(`/api/content/story/${lang.value}`),
  { staleTime: 1000 * 60 * 5 }
)

// METHODE
const methode = await useAsyncData(
  () => `content-methode-${lang.value}`,
  () => $fetch(`/api/content/methode/${lang.value}`),
  { staleTime: 1000 * 60 * 5 }
)

// CONTACT
const contact = await useAsyncData(
  () => `content-contact-${lang.value}`,
  () => $fetch(`/api/content/contact/${lang.value}`),
  { staleTime: 1000 * 60 * 5 }
)
*/

// Nyelvváltás figyelése (client-side)
if (process.client) {
  const updateLang = () => {
    lang.value = document.documentElement.lang || 'hu'
    hero.refresh()
    about.refresh()
    story.refresh()
    methode.refresh()
    contact.refresh()
  }

  const observer = new MutationObserver(updateLang)
  observer.observe(document.documentElement, { attributes: true })
}
</script>
