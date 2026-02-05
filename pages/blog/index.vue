<template>
  <section class="py-20 container mx-auto">

    <!-- TITLE -->
    <h1 class="text-4xl font-bold mb-10 text-center">
      {{ t('blog.allPosts') }}
    </h1>

    <!-- LOADING -->
    <div v-if="pending" class="text-center text-gray-500">
      {{ t('blog.loading') }}
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-center text-red-500">
      {{ t('blog.error') }}
    </div>

    <!-- EMPTY -->
    <div v-else-if="posts.length === 0" class="text-center text-gray-500">
      {{ t('blog.empty') }}
    </div>

    <!-- GRID LIST -->
    <v-row v-else justify="center">
      <v-col
        v-for="post in posts"
        :key="post._id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          class="ma-4 rounded-xl shadow bg-gray-50 hover:shadow-lg transition"
          outlined
        >

          <!-- IMAGE -->
          <v-img
            v-if="post.image"
            :src="post.image"
            height="200"
            class="rounded-t-xl"
          />

          <!-- TITLE -->
          <v-card-title class="font-bold text-xl">
            {{ post.title }}
          </v-card-title>

          <!-- META -->
          <v-card-subtitle>
            <v-icon small class="mr-1">mdi-account</v-icon>
            {{ post.author }}
            <v-icon small class="ml-4 mr-1">mdi-calendar</v-icon>
            {{ formatDate(post.date || post.createdAt) }}
          </v-card-subtitle>

          <!-- PREVIEW -->
          <v-card-text>
            {{ getPreview(post.content) }}
          </v-card-text>

          <!-- READ MORE -->
          <v-card-actions>
            <NuxtLink
              :to="`/blog/${post.slug}`"
              class="text-blue-600 font-semibold hover:underline"
            >
              {{ t('blog.readMore') }}
            </NuxtLink>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
   <!-- BACK TO HOME BUTTON -->
    <div class="mt-10">
      <NuxtLink
        to="/"
        class="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
      >
        {{ t('common.backtohome') }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { useBlog } from '~/composables/useBlog'
import { useI18n } from 'vue-i18n'

/* ---------------------------
   I18N
--------------------------- */
const { locale, t } = useI18n()

/* ---------------------------
   BLOG COMPOSABLE
--------------------------- */
const blog = useBlog()

/* ---------------------------
   SSR FETCH
--------------------------- */
const { data, pending, error, refresh } = await useAsyncData(
  () => `blog-list-${locale.value}`,
  () => blog.getPosts()
)

/* ---------------------------
   LANGUAGE CHANGE
--------------------------- */
watch(locale, () => {
  refresh()
})

/* ---------------------------
   POSTS
--------------------------- */
const posts = computed(() => Array.isArray(data.value) ? data.value : [])

/* ---------------------------
   HELPERS
--------------------------- */
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

function getPreview(text) {
  if (!text) return ''
  const plain = text.replace(/<[^>]+>/g, ' ')
  const words = plain.split(/\s+/).filter(Boolean)
  const snippet = words.slice(0, 25).join(' ')
  return snippet + (words.length > 25 ? '...' : '')
}

/* ---------------------------
   SEO META
--------------------------- 
useHead({
  title: t('blog.allPosts'),
  meta: [
    {
      name: 'description',
      content: t('blog.metaDescription')
    }
  ]
})*/
</script>
