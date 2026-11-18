<template>

  <div v-if="pending">
    Betöltés...
  </div>

  <div v-else-if="!page">
    <h1>Az oldal nem található</h1>
  </div>

  <PageRenderer
    v-else
    :page="page"
    :is-admin="isAdmin"
  />

</template>

<script setup>

import { useAuth } from '@/composables/useAuth'
import { useBrand } from '@/composables/useBrand'

const route = useRoute()

const slug = computed(() => {
  const value = route.params.slug
  if (!value) {
    return ''
  }
  return Array.isArray(value)
    ? value.join('/')
    : value
})

const isAdmin = computed(
  () => user.value?.role === 'admin'
)

const {
  settings: brand,
  loadBrand
} = useBrand()

const {
  user,
  fetchUser
} = useAuth()

await Promise.all([
  fetchUser(),
  loadBrand()
])

const effectiveSlug =
  computed(() => {

    if (
      brand.value?.maintenanceMode &&
      !isAdmin.value
    ) {
      return 'commingSoon'
    }

    return slug.value

})

const {
  data,
  pending,
  error
} = await useAsyncData(

  () => `page-${effectiveSlug.value}`,

  async () => {

    return await $fetch(
      '/api/page/by-path',
      {
        query: {
          slug: effectiveSlug.value
        }
      }
    )

  }

)

const page = computed(
  () => data.value?.item
)

const { locale } = useI18n()

//
// SEO
//

useSeoMeta({

  title: () =>

    page.value?.seo?.[
      locale.value
    ]?.title

    ||

    page.value?.name

    ||

    '',

  description: () =>

    page.value?.seo?.[
      locale.value
    ]?.description

    ||

    '',

  ogTitle: () =>

    page.value?.seo?.[
      locale.value
    ]?.title

    ||

    page.value?.name

    ||

    '',

  ogDescription: () =>

    page.value?.seo?.[
      locale.value
    ]?.description

    ||

    '',

  twitterTitle: () =>

    page.value?.seo?.[
      locale.value
    ]?.title

    ||

    page.value?.name

    ||

    '',

  twitterDescription: () =>

    page.value?.seo?.[
      locale.value
    ]?.description

    ||

    ''

})

</script>