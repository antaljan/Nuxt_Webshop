<template>
  <section :id="sectionKey" class="py-20 bg-background text-text">
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
        <div class="h-[360px] w-full bg-background animate-pulse flex items-center justify-center text-text">
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

      <!-- PUBLIC FEEDBACK TOGGLE BUTTON -->
      <div class="text-center mt-8">
        <v-btn
          color="secondary"
          variant="outlined"
          @click="showForm = !showForm"
        >
          {{ showForm ? t('feedback.form.hide') : t('feedback.form.open') }}
        </v-btn>
      </div>

      <!-- PUBLIC FEEDBACK FORM -->
      <div v-if="showForm" class="mt-12 max-w-xl mx-auto">
        <v-card class="pa-4">
          <h3 class="text-xl font-bold mb-4 text-center">
            {{ t('feedback.leaveFeedback') }}
          </h3>
          <v-form @submit.prevent="submitFeedback">
            <v-text-field
              v-model="form.name"
              :label="t('feedback.form.name')"
              required
            />
            <v-textarea
              v-model="content"
              :label="t('feedback.form.content')"
              rows="4"
              required
              :rules="[v => !!v && v.length >= 20 || t('feedback.form.tooShort')]"
            />
            <div class="my-3">
              <span>{{ t('feedback.form.rating') }}:</span>
              <v-rating v-model="form.rating" color="amber" />
            </div>
            <!-- Honeypot -->
            <input v-model="form.website" type="text" style="display:none;" />
            <!-- button row   -->
            <v-row class="mt-4" dense>
              <v-col cols="6">
                <v-btn
                  color="grey"
                  variant="text"
                  block
                  @click="showForm = false"
                >
                  {{ t('feedback.form.cancel') }}
                </v-btn>
              </v-col>
            <v-col cols="6">
              <v-btn
                color="primary"
                block
                :disabled="!isContentValid || loading"
                @click="submitFeedback"
              >
                {{ t('feedback.form.submit') }}
              </v-btn>
            </v-col>
            </v-row>
          </v-form>
          <v-alert
            v-if="success"
            type="success"
            class="mt-4"
          >
            {{ t('feedback.form.success') }}
          </v-alert>
          <v-alert
            v-if="error"
            type="error"
            class="mt-4"
          >
            {{ error }}
          </v-alert>
        </v-card>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const showForm = ref(false)

const props = defineProps({
  sectionKey: { type: String, required: true },
  slug: { type: String, required: false }
})

/* ---------------------------
   I18N (MUSS GANZ OBEN SEIN!)
--------------------------- */
const { locale, t } = useI18n()

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
   RUNTIME CONFIG
--------------------------- */
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

/* ---------------------------
   PUBLIC FORM STATE
--------------------------- */
const loading = ref(false)
const success = ref(false)
const error = ref(null)

const content = ref('')
const isContentValid = computed(() => {
  return content.value.trim().length >= 20
})

const form = reactive({
  name: '',
  content: '',
  rating: 5,
  language: locale.value,      // jetzt OK
  slug: props.slug || null,
  website: ''                  // honeypot
})

/* ---------------------------
   LOAD FEEDBACKS
--------------------------- */
const { data: feedbacks, refresh } = await useAsyncData(
  () => `feedbacks-${locale.value}-${props.slug || 'all'}`,
  () =>
    $fetch(`${backendBase}/feedbacks`, {
      params: {
        language: locale.value,
        status: 'published',
        slug: props.slug || undefined
      }
    })
)

/* ---------------------------
   LANGUAGE CHANGE
--------------------------- */
watch(locale, () => {
  form.language = locale.value   // wichtig!
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

/* ---------------------------
   SUBMIT FEEDBACK
--------------------------- */

const submitFeedback = async () => {
  form.content = content.value
  loading.value = true
  error.value = null

  try {
    const res = await $fetch(`${backendBase}/feedbacks/new`, {
      method: 'POST',
      body: form
    })

    if (res.success) {
      success.value = true
      form.name = ''
      form.content = ''
      form.rating = 5
      content.value = ''
    }

  } catch (e) {
    error.value = e?.data?.error || 'Hiba történt'
  } finally {
    loading.value = false
  }
}


</script>


<style scoped>
.scrollable-text {
  max-height: 260px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
