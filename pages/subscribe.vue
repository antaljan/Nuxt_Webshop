<template>
  <section class="max-w-md mx-auto px-6 py-12">
    <!-- Back to home -->
    <NuxtLink
      to="/"
      class="inline-flex items-center text-sm text-primary hover:underline mb-6"
    >
      {{ $t('common.backtohome') }}
    </NuxtLink>

    <!-- Title -->
    <h1 class="text-3xl font-bold mb-4 text-center">
      {{ $t('newsletter.subscribeTitle') }}
    </h1>

    <!--p class="text-center text-gray-600 mb-8">
      {{ $t('newsletter.subscribeDescription') }}
    </p-->

    <!-- Form -->
    <v-card class="p-6 rounded-xl shadow bg-white">
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="firstname"
          :label="$t('newsletter.firstname')"
          :rules="[v => !!v || $t('newsletter.errorName')]"
          required
        />

        <v-text-field
          v-model="name"
          :label="$t('newsletter.lastname')"
          :rules="[v => !!v || $t('newsletter.errorName')]"
          required
        />

        <v-text-field
          v-model="email"
          :label="$t('newsletter.email')"
          :rules="[v => /.+@.+\..+/.test(v) || $t('newsletter.errorEmail')]"
          required
        />

        <v-checkbox
          v-model="gdpr"
          :rules="[v => !!v || $t('newsletter.errorGdpr')]"
          required
        >
          <template #label>
            {{ $t('newsletter.gdpr.before') }}
            <NuxtLink to="/gdpr" target="_blank" class="text-primary">
              {{ $t('newsletter.gdpr.link') }}
            </NuxtLink>
          </template>
        </v-checkbox>

        <div class="flex justify-end mt-4">
          <v-btn
            color="primary"
            variant="flat"
            :loading="loading"
            @click="submit"
          >
            {{ $t('newsletter.subscribeButton') }}
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <!-- Success message -->
    <div
      v-if="success"
      class="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center"
    >
      {{ $t('newsletter.successMessage') }}
    </div>
  </section>
</template>

<script setup>
useHead({
  title: 'Hírlevél feliratkozás – Antali Gyöngyi Edit | Coaching, önismeret, fejlődés',
  meta: [
    {
      name: 'description',
      content:
        'Iratkozz fel Antali Gyöngyi Edit hírlevelére és kapj inspiráló önismereti tartalmakat, coaching tippeket és exkluzív ajánlatokat. Támogasd a saját fejlődésedet minden héten.'
    },
    {
      name: 'keywords',
      content:
        'coaching, önismeret, személyes fejlődés, hírlevél, Antali Gyöngyi Edit, életvezetés, mentális egészség, önbizalom, motiváció'
    },
    {
      property: 'og:title',
      content: 'Hírlevél feliratkozás – Antali Gyöngyi Edit'
    },
    {
      property: 'og:description',
      content:
        'Csatlakozz Gyöngyi hírleveléhez és kapj inspiráló tartalmakat, coaching tippeket és személyes útmutatást a fejlődésedhez.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://antaligyongyi.hu/subscribe'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://antaligyongyi.hu/subscribe'
    }
  ]
})

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = ref(null)
const valid = ref(false)
const firstname = ref('')
const name = ref('')
const email = ref('')
const gdpr = ref(false)
const loading = ref(false)
const success = ref(false)

async function submit() {
  if (!form.value) return

  const ok = await form.value.validate()
  if (!ok) return

  loading.value = true
  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        firstname: firstname.value,
        name: name.value,
        email: email.value
      }
    })

    success.value = true
    firstname.value = ''
    name.value = ''
    email.value = ''
    gdpr.value = false
    form.value.resetValidation()
  } catch (err) {
    alert(t('newsletter.errorGeneral'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
a:hover {
  opacity: 0.8;
}
</style>
