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
//console.log('ROUTE PARAMS:', route.params)
/* ---------------------------
   SSR FETCH SINGLE POST
--------------------------- */
const slug = Array.isArray(route.params.slug)
  ? route.params.slug[0]
  : route.params.slug
//console.log('SLUG:', slug)
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
useHead(() => {
  const p = post.value || {}
  const url = `https://antaligyongyi.hu/blog/${slug}`

  return {
    title: p.title,
    meta: [
      // Alap description (ha nincs subtitle, használjuk a tartalom 160 karakterét)
      {
        name: 'description',
        content: p.subtitle || (p.content ? p.content.replace(/<[^>]+>/g, '').slice(0, 160) : '')
      },

      // Canonical (nagyon fontos duplikált tartalom miatt)
      { rel: 'canonical', href: url },

      // Open Graph
      { property: 'og:title', content: p.title },
      { property: 'og:description', content: p.subtitle },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: p.image },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: locale.value },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: p.title },
      { name: 'twitter:description', content: p.subtitle },
      { name: 'twitter:image', content: p.image }
    ],

    // Rich Snippet (Google számára)
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: p.title,
          description: p.subtitle,
          image: [p.image],
          author: {
            '@type': 'Person',
            name: p.author
          },
          datePublished: p.date || p.createdAt,
          dateModified: p.updatedAt || p.date || p.createdAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url
          }
        })
      }
    ]
  }
})
</script>

<style>
/* Global blog typography override */

.prose {
  @apply text-gray-800 leading-relaxed;
}

/* Headings */
.prose h1 {
  @apply text-4xl font-extrabold text-primary-600 mb-6;
}

.prose h2 {
  @apply text-3xl font-bold text-primary-600 mt-10 mb-4;
}

.prose h3 {
  @apply text-2xl font-semibold text-primary-500 mt-8 mb-3;
}

/* Paragraphs */
.prose p {
  @apply mb-6 text-lg;
}

/* Links */
.prose a {
  @apply text-primary-600 font-semibold underline decoration-2 underline-offset-4
         transition-colors hover:text-primary-700;
}

/* Images */
.prose img {
  @apply my-8 rounded-xl shadow-md;
}

/* Blockquotes */
.prose blockquote {
  @apply border-l-4 border-primary-500 pl-6 italic my-6 text-gray-700 bg-gray-50 py-4 rounded-md;
}

/* Ordered & unordered lists */
.prose ul,
.prose ol {
  @apply my-6 ml-6;
}

.prose li {
  @apply mb-2;
}

/* Code blocks */
.prose pre {
  @apply bg-gray-900 text-gray-100 p-5 rounded-xl shadow-inner overflow-x-auto my-6;
}

/* Inline code */
.prose code {
  @apply bg-gray-200 px-1.5 py-0.5 rounded text-primary-700;
}
</style>
