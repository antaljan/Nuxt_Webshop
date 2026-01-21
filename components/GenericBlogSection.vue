<template>
  <section :id="sectionKey" class="py-20">
    <div class="container mx-auto">

      <!-- TITLE -->
      <h2 class="text-3xl font-bold text-center mb-10">
        {{ t('blog.latest') }}
      </h2>

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

      <!-- CAROUSEL -->
      <v-carousel
        v-else
        height="480"
        hide-delimiter-background
        show-arrows
        cycle
      >
        <v-carousel-item
          v-for="(group, idx) in grouped"
          :key="idx"
        >
          <v-row justify="center" align="stretch">
            <v-col
              v-for="post in group"
              :key="post._id"
              cols="12"
              md="4"
            >
              <v-card class="ma-4 rounded-xl shadow bg-gray-50" outlined>
                
                <!-- IMAGE -->
                <v-img
                  v-if="post.image"
                  :src="post.image"
                  height="170px"
                  class="rounded-t-xl"
                />

                <!-- TITLE -->
                <v-card-title class="font-bold text-lg">
                  {{ post.title }}
                </v-card-title>

                <!-- SUBTITLE -->
                <v-card-subtitle v-if="post.subtitle">
                  <v-icon small class="mr-1">mdi-format-quote-close</v-icon>
                  {{ post.subtitle }}
                </v-card-subtitle>

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

                  <div class="mt-3">
                    <NuxtLink
                      :to="`/blog/${post.slug}`"
                      class="text-blue-600 font-semibold hover:underline"
                    >
                      {{ t('blog.readMore') }}
                    </NuxtLink>
                  </div>
                </v-card-text>

              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <!-- VIEW ALL BUTTON -->
      <div class="text-center mt-10">
        <NuxtLink
          to="/blog"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {{ t('blog.viewAll') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/* ---------------------------
   I18N
--------------------------- */
const { locale, t } = useI18n()

/* ---------------------------
   RUNTIME CONFIG
--------------------------- */
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

/* ---------------------------
   SSR FETCH BLOG POSTS
--------------------------- */
const { data, pending, error, refresh } = await useAsyncData(
  () => `blog-posts-${locale.value}`,
  () =>
    $fetch(`${backendBase}/posts`, {
      params: {
        language: locale.value
      }
    })
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
   RESPONSIVE GROUPING
--------------------------- */
const isMobile = computed(() => {
  if (process.server) return false
  return window.innerWidth < 600
})

const grouped = computed(() => {
  const per = isMobile.value ? 1 : 3
  const result = []
  for (let i = 0; i < posts.value.length; i += per) {
    result.push(posts.value.slice(i, i + per))
  }
  return result
})

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
  const snippet = words.slice(0, 30).join(' ')
  return snippet + (words.length > 30 ? '...' : '')
}
</script>
