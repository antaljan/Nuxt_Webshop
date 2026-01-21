<template>
  <section class="py-20 container mx-auto max-w-3xl">

    <!-- LOADING -->
    <div v-if="pending" class="text-center text-gray-500">
      {{ t('blog.loading') }}
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ t('blog.error') }}
    </div>

    <!-- CONTENT -->
    <article v-else>

      <!-- TITLE -->
      <h1 class="text-4xl font-bold mb-4">
        {{ post.title }}
      </h1>

      <!-- META -->
      <p class="text-gray-600 mb-6 flex items-center">
        <v-icon small class="mr-1">mdi-account</v-icon>
        {{ post.author }}

        <v-icon small class="ml-4 mr-1">mdi-calendar</v-icon>
        {{ formatDate(post.date || post.createdAt) }}
      </p>

      <!-- IMAGE -->
      <v-img
        v-if="post.image"
        :src="post.image"
        height="350"
        class="rounded-xl mb-8"
      />

      <!-- CONTENT HTML -->
      <div
        v-html="post.content"
        class="prose max-w-none"
      ></div>

      <!-- BACK LINK -->
      <NuxtLink
        to="/blog"
        class="inline-block mt-10 text-blue-600 font-semibold hover:underline"
      >
        ← {{ t('blog.backToList') }}
      </NuxtLink>

    </article>

  </section>
</template>

<script setup>
import { useBlog } from '~/composables/useBlog'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { locale, t } = useI18n()
const blog = useBlog()
console.log('ROUTE PARAMS:', route.params)
/* ---------------------------
   SSR FETCH SINGLE POST
--------------------------- */
const slug = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug
console.log('SLUG:', slug)
const { data, pending, error, refresh } = await useAsyncData(
  () => `blog-${slug}-${locale.value}`,
  () => blog.getPostBySlug(slug)
)

/* ---------------------------
   LANGUAGE CHANGE
--------------------------- */
watch(locale, () => {
  refresh()
})

/* ---------------------------
   POST
--------------------------- */
const post = computed(() => data.value || {})

/* ---------------------------
   HELPERS
--------------------------- */
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

/* ---------------------------
   SEO META
--------------------------- */
useHead(() => ({
  title: post.value.title || 'Blog',
  meta: [
    {
      name: 'description',
      content: post.value.subtitle || post.value.title
    },
    {
      property: 'og:title',
      content: post.value.title
    },
    {
      property: 'og:description',
      content: post.value.subtitle
    },
    {
      property: 'og:image',
      content: post.value.image
    }
  ]
}))
</script>

<style scoped>
/* Optional: improve readability of HTML content */
.prose p {
  margin-bottom: 1rem;
  line-height: 1.7;
}
.prose img {
  border-radius: 12px;
  margin: 1.5rem 0;
}
</style>
