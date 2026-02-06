<template>
  <v-container class="py-10" max-width="400">
    <v-card class="pa-6">
      <h2 class="text-h5 mb-4">{{ $t('auth.login.title') }}</h2>

      <v-text-field
        v-model="email"
        :label="$t('auth.login.email')"
        type="email"
        variant="outlined"
      />

      <v-text-field
        v-model="psw"
        :label="$t('auth.login.password')"
        type="password"
        variant="outlined"
      />

      <v-btn
        color="primary"
        block
        class="mt-4"
        :loading="loading"
        @click="doLogin"
      >
        {{ $t('auth.login.button') }}
      </v-btn>

      <div class="mt-4 text-center">
        <NuxtLink to="/register" class="text-sm text-blue-600">
          {{ $t('auth.login.noAccount') }}
        </NuxtLink>
      </div>

      <NuxtLink to="/forgot-password" class="text-sm text-blue-600">
        {{ $t('auth.login.forgotenPsw') }}
      </NuxtLink>

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
const email = ref('')
const psw = ref('')
const error = ref(null)
const loading = ref(false)

const { t } = useI18n()
const { login } = useAuth()

async function doLogin() {
  loading.value = true
  error.value = null

  try {
    const route = useRoute()
    const redirect = route.query.redirect || '/'

    await login(email.value, psw.value)

    navigateTo(redirect)

  } catch (e) {
    error.value = t('auth.login.errors.invalid')
  } finally {
    loading.value = false
  }
}
</script>