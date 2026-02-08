<template>
  <v-container class="py-10" max-width="400">
    <v-card class="pa-6">
      <h2 class="text-h5 mb-4">{{ $t('auth.login.title') }}</h2>
      <!-- email -->
      <v-text-field
        v-model="email"
        :label="$t('auth.login.email')"
        type="email"
        variant="outlined"
      />
      <!-- password -->
      <v-text-field
        v-model="psw"
        :label="$t('auth.login.password')"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        autocomplete="new-password"
        autocapitalize="off"
        spellcheck="false"
      />
      <!--  login button  -->
      <v-btn
        color="primary"
        block
        class="mt-4"
        :loading="loading"
        @click="doLogin"
      >
        {{ $t('auth.login.button') }}
      </v-btn>
      <!--  no account & forgotten password link -->
      <div class="mt-4 flex flex-col items-center gap-2">
        <NuxtLink to="/register" class="text-sm text-blue-600 hover:underline">
          {{ $t('auth.login.noAccount') }}
        </NuxtLink>
        <NuxtLink to="/forgot-password" class="text-sm text-blue-600 hover:underline">
          {{ $t('auth.login.forgotenPsw') }}
        </NuxtLink>
      </div>
      <!--  error message -->
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
  const showPassword = ref(false)
  const error = ref(null)
  const loading = ref(false)
  const { t } = useI18n()
  const { login } = useAuth()
  // init
  onMounted(() => {
    email.value = ''
    psw.value = ''
    showPassword.value = false
  })
  // loding
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