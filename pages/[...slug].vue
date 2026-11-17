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

const route = useRoute()

const slug = computed(() => {

  const value = route.params.slug

  return Array.isArray(value)
    ? value.join('/')
    : value

})

const { user } = useAuth()

const isAdmin = computed(
  () => user.value?.role === 'admin'
)

const {
  data,
  pending,
  error
} = await useAsyncData(

  () => `page-${slug.value}`,

  async () => {

    return await $fetch(
      '/api/page/by-path',
      {
        query: {
          slug: slug.value
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