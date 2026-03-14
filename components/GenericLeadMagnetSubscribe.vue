<script setup>
const { t, locale } = useI18n()
// Props: leadMagnetSlug a legfontosabb összekötő kapocs!
const props = defineProps(['title', 'buttonText', 'leadMagnetSlug'])

const firstname = ref('')
const name = ref('') // Hozzáadva a vezetéknévhez
const email = ref('')
const gdpr = ref(false)
const loading = ref(false)
const success = ref(false)
const valid = ref(false)
const form = ref(null)

async function handleSubscribe() {
  const { valid: isFormValid } = await form.value.validate()
  if (!isFormValid) return

  loading.value = true
  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        firstname: firstname.value,
        name: name.value,
        email: email.value,
        language: locale.value,
        // FONTOS: Összehangolva a Controller campaignSlug változójával
        campaignSlug: props.leadMagnetSlug 
      }
    })
    success.value = true
    
    // Profi érintés: sikeres feliratkozás után ürítjük a formot
    firstname.value = ''
    name.value = ''
    email.value = ''
    gdpr.value = false
    if (form.value) form.value.resetValidation()

  } catch (err) {
    console.error("Subscription error:", err)
    alert("Hiba történt. Kérlek próbáld újra!")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card class="pa-6 rounded-xl shadow-lg border-2" :style="{ borderColor: 'var(--v-primary-base)' }">
    <h3 class="text-h5 font-bold mb-4 text-center">{{ title || t('newsletter.subscribeTitle') }}</h3>
    
    <v-form ref="form" v-model="valid" @submit.prevent="handleSubscribe">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <v-text-field v-model="name" :label="t('newsletter.lastname')" :rules="[v => !!v || '']" variant="outlined" density="comfortable" />
        <v-text-field v-model="firstname" :label="t('newsletter.firstname')" :rules="[v => !!v || '']" variant="outlined" density="comfortable" />
      </div>

      <v-text-field v-model="email" :label="t('newsletter.email')" :rules="[v => /.+@.+\..+/.test(v) || '']" variant="outlined" density="comfortable" />
      
      <v-checkbox v-model="gdpr" :rules="[v => !!v || '']" density="compact" hide-details class="mb-4">
        <template #label><span class="text-caption">{{ t('newsletter.gdpr.link') }}</span></template>
      </v-checkbox>

      <v-btn type="submit" color="primary" block size="x-large" :loading="loading" :disabled="!valid">
        {{ buttonText || t('newsletter.subscribeButton') }}
      </v-btn>
    </v-form>

    <v-fade-transition>
      <v-alert v-if="success" type="success" variant="tonal" class="mt-4" icon="mdi-check-circle">
        {{ t('newsletter.successMessage') }}
      </v-alert>
    </v-fade-transition>
  </v-card>
</template>