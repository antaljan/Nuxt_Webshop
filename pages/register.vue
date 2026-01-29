<template>
  <v-container class="py-10" max-width="400">
    <v-card class="pa-6">
      <h2 class="text-h5 mb-4">{{ $t('auth.register.title') }}</h2>

      <v-text-field
        v-model="firstname"
        :label="$t('auth.register.firstname')"
        variant="outlined"
      />

      <v-text-field
        v-model="lastname"
        :label="$t('auth.register.lastname')"
        variant="outlined"
      />

      <v-text-field
        v-model="email"
        :label="$t('auth.register.email')"
        type="email"
        variant="outlined"
      />

      <v-text-field
        v-model="psw"
        :label="$t('auth.register.password')"
        type="password"
        variant="outlined"
      />

      <v-text-field
        v-model="adress"
        :label="$t('auth.register.adress')"
        variant="outlined"
      />

      <v-text-field
        v-model="phone"
        :label="$t('auth.register.phone')"
        variant="outlined"
      />

      <v-btn
        color="primary"
        block
        class="mt-4"
        :loading="loading"
        @click="doRegister"
      >
        {{ $t('auth.register.button') }}
      </v-btn>

      <div class="mt-4 text-center">
        <NuxtLink to="/login" class="text-sm text-blue-600">
          {{ $t('auth.register.haveAccount') }}
        </NuxtLink>
      </div>

      <v-alert
        v-if="error"
        type="error"
        class="mt-4"
        border="start"
        variant="tonal"
      >
        {{ error }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const psw = ref('')
const adress = ref('')
const phone = ref('')

const error = ref(null)
const loading = ref(false)

const { t } = useI18n()

async function doRegister() {
  if (!firstname.value || !lastname.value || !email.value || !psw.value || !adress.value) {
    error.value = t('auth.register.errors.required')
    return
  }

  loading.value = true
  error.value = null

  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        firstname: firstname.value,
        name: lastname.value,
        email: email.value,
        psw: psw.value,
        adress: adress.value,
        phone: phone.value || '',
        rolle: 'user'
      }
    })

    const route = useRoute()
    const redirect = route.query.redirect || '/'
    navigateTo(redirect)

  } catch (e) {
    if (e?.status === 409) {
      error.value = t('auth.register.errors.emailExists')
    } else {
      error.value = t('auth.register.errors.general')
    }
  } finally {
    loading.value = false
  }
}
</script>