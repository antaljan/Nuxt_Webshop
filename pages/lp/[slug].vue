<script setup>
const route = useRoute()
const { locale } = useI18n()

// 1. Adatbetöltés (Slug alapján)
const slug = route.params.slug

const { data: response, error } = await useAsyncData(
  `lp-data-${slug}`,
  () => $fetch(`/api/leadmagnet/by-slug/${slug}`)
)
const page = computed(() => response.value?.item)

// 2. SEO Beállítások (Dinamikusan az adatbázisból)
watchEffect(() => {
  if (page.value?.seo) {
    const seo = page.value.seo[locale.value] || page.value.seo['en'] // Fallback nyelvre
    useSeoMeta({
      title: seo.title,
      ogTitle: seo.title,
      description: seo.description,
      ogDescription: seo.description,
      ogImage: seo.image || '/default-share.jpg',
      twitterCard: 'summary_large_image',
    })
  }
})

// 3. Komponens Térkép
const componentMap = {
  Hero: resolveComponent('GenericHeroSection'),
  HtmlText: resolveComponent('GenericHtmlTextSection'),
  ImageText: resolveComponent('GenericImageTextSection'),
  Separator: resolveComponent('SectionSeparator'),
  Contact: resolveComponent('GenericContactSection')
}

// Konverzió követés (ha pl. feliratkozik)
const trackConversion = async () => {
  await $fetch(`/api/leadmagnet/${route.params.slug}/convert`, { method: 'POST' })
}
</script>

<template>
  <div v-if="page">
    <div v-for="(sec, index) in page.sections" :key="index">
      <component 
        :is="componentMap[sec.type]" 
        :section="sec.key"
        v-bind="sec.props"
        @success="trackConversion"
      />
    </div>
  </div>
  <v-container v-else class="text-center py-10">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>
