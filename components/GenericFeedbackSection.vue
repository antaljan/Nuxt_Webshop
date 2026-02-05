<template>
  <section :id="sectionKey" class="py-20 bg-gray-50">
    <div class="container mx-auto">

      <!-- TITLE -->
      <h2 class="text-3xl font-bold text-center mb-10">
        {{ t('feedback.title') }}
        <span class="inline-block animate-pulse text-red-500 text-3xl ml-2">❤️</span>
      </h2>

      <!-- CAROUSEL -->
      <ClientOnly>
      <v-carousel
        height="360"
        hide-delimiters
        show-arrows="hover"
        cycle
      >
        <v-carousel-item
          v-for="(group, index) in grouped"
          :key="index"
        >
          <!-- MOBILE: 1 card -->
          <div v-if="isMobile" class="px-4">
            <v-card class="w-full" outlined>
              <v-card-title class="font-bold">
                {{ group[0].name }}
              </v-card-title>
              <v-card-text class="scrollable-text">
                <div v-html="group[0].content"></div>
              </v-card-text>
            </v-card>
          </div>

          <!-- DESKTOP: multiple cards -->
          <v-row v-else justify="center" align="stretch" dense>
            <v-col
              v-for="(item, i) in group"
              :key="i"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="h-full flex flex-col" outlined>
                <v-card-title class="font-bold">
                  {{ item.name }}
                </v-card-title>
                <v-card-text class="scrollable-text">
                  <div v-html="item.content"></div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
      <template #fallback>
        <div class="h-[360px] w-full bg-gray-100 animate-pulse flex items-center justify-center">
          Loading content...
        </div>
      </template>
      </ClientOnly>
      
      <!-- ADMIN BUTTON -->
      <div v-if="isAdmin" class="text-center mt-8">
        <v-btn color="primary" @click="goAdmin">
          Admin Feedbacks
        </v-btn>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const props = defineProps({
  sectionKey: { type: String, required: true }
})

/* ---------------------------
   AUTH
--------------------------- */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

/* ---------------------------
   ROUTER
--------------------------- */
const router = useRouter()
const goAdmin = () => router.push('/admin/feedbacks')

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
   LOAD FEEDBACKS (SSR + CSR)
--------------------------- */
const { data: feedbacks, refresh } = await useAsyncData(
  () => `feedbacks-${locale.value}`,
  () =>
    $fetch(`${backendBase}/feedbacks`, {
      params: {
        language: locale.value,
        status: 'published'
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
   RESPONSIVE LOGIC
--------------------------- */
const isMobile = computed(() => {
  if (process.server) return false
  return window.innerWidth < 600
})

const itemsPerSlide = computed(() => {
  if (isMobile.value) return 1
  if (process.client && window.innerWidth < 960) return 2
  if (process.client && window.innerWidth < 1280) return 3
  return 4
})

/* ---------------------------
   GROUPING
--------------------------- */
const grouped = computed(() => {
  const list = feedbacks.value || []
  const groups = []
  const per = itemsPerSlide.value

  for (let i = 0; i < list.length; i += per) {
    groups.push(list.slice(i, i + per))
  }
  return groups
})
</script>

<style scoped>
.scrollable-text {
  max-height: 260px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
