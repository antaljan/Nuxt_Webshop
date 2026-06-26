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
// JAVÍTOTT rész a pages/lp/[slug].vue fájlban

// Ellenőrizzük, hogy kaptunk-e egyáltalán tömböt
const rawContents = Array.isArray(contents) ? contents : [];

const contentMap = rawContents.reduce((acc, curr) => {
  // Csak akkor dolgozzuk fel, ha van érvényes szekció kulcsa
  if (curr && (curr.section || curr.sectionKey)) {
    const key = curr.section || curr.sectionKey;
    
    // Ha még nincs ilyen kulcs az indexben, vagy a mostani frissebb/teljesebb, elmentjük
    if (!acc[key] || (curr.updatedAt && (!acc[key].updatedAt || new Date(curr.updatedAt) > new Date(acc[key].updatedAt)))) {
      acc[key] = curr;
    }
  }
  return acc;
}, {});


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
      ogImage: seo.image || 'https://antaligyongyi.hu/backend/uploads/image-1768250585414-470165819.jpg',
      twitterImage: seo.image || 'https://antaligyongyi.hu/backend/uploads/image-1768250585414-470165819.jpg',
      twitterCard: 'summary_large_image'
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
  // Biztonsági fallback objektum, ha a tartalom hiányos lenne
  const safeContent = content || { title: '', buttonText: '', paragraphs: [], html: '' };

  if (sec.type === 'Subscribe') {
    return {
      title: safeContent.title || 'Feliratkozás',
      buttonText: safeContent.buttonText || 'Küldés',
      leadMagnetSlug: safeContent.leadMagnetSlug || route.params.slug
    }
  }
  
  return {
    content: safeContent,
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