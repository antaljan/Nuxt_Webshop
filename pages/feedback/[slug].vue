<template>
  <section class="py-20 bg-background text-text">
    <div class="container mx-auto max-w-xl">

      <!-- TITLE -->
      <h1 class="text-3xl font-bold text-center mb-10">
        {{ t('feedback.leaveFeedback') }}
      </h1>

      <!-- FORM -->
      <v-card class="pa-4">
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

          <v-btn
            color="primary"
            block
            :disabled="!isContentValid || loading"
            @click="submitFeedback"
          >
            {{ t('feedback.form.submit') }}
          </v-btn>
        </v-form>

        <v-alert v-if="success" type="success" class="mt-4">
          {{ t('feedback.form.success') }}
        </v-alert>

        <v-alert v-if="error" type="error" class="mt-4">
          {{ error }}
        </v-alert>
      </v-card>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const slug = route.params.slug

const { locale, t } = useI18n()

const config = useRuntimeConfig()
const backendBase = config.public.backendBase

/* ---------------------------
FORM STATE
--------------------------- */
const loading = ref(false)
const success = ref(false)
const error = ref(null)
const content = ref('')

const isContentValid = computed(() => content.value.trim().length >= 20)

const form = reactive({
  name: '',
  content: '',
  rating: 5,
  language: locale.value,
  slug,
  website: '' // honeypot
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
