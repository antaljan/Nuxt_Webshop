<script setup>
const route = useRoute()
const { locale } = useI18n()

// 1. Struktúra és Tartalom betöltése
const slug = route.params.slug

const { data: lpResponse, refresh } = await useAsyncData(
  `lp-full-${slug}-${locale.value}`,
  async () => {
    // Először lekapjuk a struktúrát
    const lm = await $fetch(`/api/leadmagnet/by-slug/${slug}`)
    if (!lm?.item) return null

    // Kigyűjtjük az ID-kat/Kulcsokat a tartalom lekéréshez
    const sectionKeys = lm.item.sections.map(s => s.key)

    // Lekérjük a hozzájuk tartozó konkrét tartalmakat (szövegek, képek)
    // Megjegyzés: Ez az endpoint a backend-en egy $in: sectionKeys query-t futtat
    const contents = await $fetch(`/api/content/bulk-load`, {
      method: 'POST',
      body: {
        keys: sectionKeys,
        lang: locale.value
      }
    })

    // Indexeljük a tartalmat a könnyű eléréshez: { "key-123": { title: '...', html: '...' } }
    const contentMap = contents.reduce((acc, curr) => {
      acc[curr.section] = curr
      return acc
    }, {})

    return {
      page: lm.item,
      contentMap
    }
  }
)

const page = computed(() => lpResponse.value?.page)
const contentMap = computed(() => lpResponse.value?.contentMap || {})

// 2. Nyelvváltás figyelése (mint az index.vue-nál)
watch(locale, () => refresh())

// 3. SEO (Dinamikusan)
watchEffect(() => {
  if (page.value?.seo) {
    const seo = page.value.seo[locale.value] || page.value.seo['en']
    useSeoMeta({
      title: seo.title,
      description: seo.description,
      ogTitle: seo.title,
      ogDescription: seo.description,
    })
  }
})

// 4. Komponens regisztráció
const componentMap = {
  Hero: resolveComponent('GenericHeroSection'),
  HtmlText: resolveComponent('GenericHtmlTextSection'),
  ImageText: resolveComponent('GenericImageTextSection'),
  Separator: resolveComponent('SectionSeparator'),
  Contact: resolveComponent('GenericContactSection'),
  Subscribe: resolveComponent('GenericLeadMagnetSubscribe')
}

const getSectionProps = (sec, content) => {
  if (sec.type === 'Subscribe') {
    return {
      title: content.title,
      buttonText: content.buttonText,
      leadMagnetSlug: content.leadMagnetSlug
    }
  }
  // A többi szekciónál marad a megszokott 'content'
  return {
    content: content,
    sectionKey: sec.key,
    ...sec.props
  }
}
</script>

<template>
  <div v-if="page">
    <div v-for="(sec, index) in page.sections" :key="sec.key">
      <component
        :is="componentMap[sec.type]"
        v-if="contentMap[sec.key]"
        v-bind="getSectionProps(sec, contentMap[sec.key])"
      />
    </div>
  </div>
  <v-container v-else class="text-center py-16">
    <v-progress-circular indeterminate color="primary" />
  </v-container>
</template>