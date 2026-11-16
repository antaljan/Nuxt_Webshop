```vue
<script setup>

const { t, locale } = useI18n()

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

const firstname = ref('')
const name = ref('')
const email = ref('')

const gdpr = ref(false)
const loading = ref(false)
const success = ref(false)

const valid = ref(false)
const form = ref(null)

async function handleSubscribe() {

  const { valid: isFormValid } =
    await form.value.validate()

  if (!isFormValid) {
    return
  }

  const campaignSlug =
    props.content?.leadMagnetSlug

  if (!campaignSlug) {

    console.error(
      'Missing leadMagnetSlug'
    )

    alert(
      'A feliratkozási kampány nincs konfigurálva.'
    )

    return

  }

  loading.value = true

  try {

    await $fetch(
      '/api/newsletter/subscribe',
      {
        method: 'POST',

        body: {
          firstname: firstname.value,
          name: name.value,
          email: email.value,

          language: locale.value,

          campaignSlug
        }
      }
    )

    success.value = true

    firstname.value = ''
    name.value = ''
    email.value = ''

    gdpr.value = false

    if (form.value) {
      form.value.resetValidation()
    }

    navigateTo(
      `/lp/${campaignSlug}_success`,
      {
        replace: true
      }
    )

  } catch (err) {

    console.error(
      'Subscription error:',
      err
    )

    alert(
      'Hiba történt. Kérlek próbáld újra!'
    )

  } finally {

    loading.value = false

  }

}

</script>

<template>

  <v-card
    id="subscribe"
    class="pa-6 rounded-xl shadow-lg border-2"
    :style="{
      borderColor: 'var(--v-primary-base)'
    }"
  >

    <h3
      class="text-h5 font-bold mb-2 text-center"
    >
      {{
        content.title ||
        t('newsletter.subscribeTitle')
      }}
    </h3>

    <div
      v-if="content.description"
      class="text-center mb-4"
    >
      {{ content.description }}
    </div>

    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="handleSubscribe"
    >

      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-2"
      >

        <v-text-field
          v-model="firstname"
          :label="
            t('newsletter.firstname')
          "
          :rules="[
            v => !!v || ''
          ]"
          variant="outlined"
          density="comfortable"
        />

      </div>

      <v-text-field
        v-model="email"
        :label="
          t('newsletter.email')
        "
        :rules="[
          v =>
            /.+@.+\..+/.test(v)
            || ''
        ]"
        variant="outlined"
        density="comfortable"
      />

      <v-checkbox
        v-model="gdpr"
        :rules="[
          v => !!v || ''
        ]"
        density="compact"
        hide-details
        class="mb-4"
      >

        <template #label>

          {{ $t('newsletter.gdpr.before') }}

          <NuxtLink
            to="/gdpr"
            target="_blank"
            class="text-primary"
          >
            {{ $t('newsletter.gdpr.link') }}
          </NuxtLink>

        </template>

      </v-checkbox>

      <v-btn
        type="submit"
        color="primary"
        block
        size="x-large"
        :loading="loading"
        :disabled="!valid"
      >
        {{
          content.ctaText ||
          t(
            'newsletter.subscribeButton'
          )
        }}
      </v-btn>

    </v-form>

  </v-card>

</template>
```