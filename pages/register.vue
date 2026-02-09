<template>
  <v-container class="py-10" max-width="400">
    <v-card class="pa-6">
      <h2 class="text-h5 mb-4">{{ $t('auth.register.title') }}</h2>
      <!--  first name  -->
      <v-text-field
        v-model="firstname"
        :label="$t('auth.register.firstname')"
        variant="outlined"
      />
      <!--  last name -->
      <v-text-field
        v-model="lastname"
        :label="$t('auth.register.lastname')"
        variant="outlined"
      />
      <!--  email -->
      <v-text-field
        v-model="email"
        :label="$t('auth.register.email')"
        type="email"
        variant="outlined"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />
      <!--  password  -->
      <v-text-field
        v-model="psw"
        :label="$t('auth.register.password')"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        autocomplete="new-password"
      />
      <!--  adress  -->
      <v-text-field
        v-model="country"
        :label="$t('auth.register.country')"
        variant="outlined"
        autocomplete="off"
      />
      <div class="grid grid-cols-2 gap-4">
        <v-text-field
          v-model="zip"
          :label="$t('auth.register.zip')"
          variant="outlined"
          autocomplete="off"
        />
        <v-text-field
          v-model="city"
          :label="$t('auth.register.city')"
          variant="outlined"
          autocomplete="off"
        />
      </div>
      <v-text-field
        v-model="street"
        :label="$t('auth.register.street')"
        variant="outlined"
        autocomplete="off"
      />
      <!--  phone -->
      <v-text-field
        v-model="phone"
        :label="$t('auth.register.phone')"
        variant="outlined"
      />
      <!-- AGB -->
      <v-checkbox
        v-model="acceptAGB"
        :label="`${$t('auth.register.acceptAgb')} `"
      >
        <template #label>
          <span>
            {{ $t('auth.register.acceptAgb') }}
            <NuxtLink to="/agb" class="text-blue-600 underline ml-1" target="_blank">
              {{ $t('auth.register.readAgb') }}
            </NuxtLink>
          </span>
        </template>
      </v-checkbox>
      <!-- GDPR -->
      <v-checkbox
        v-model="acceptGDPR"
        :label="`${$t('auth.register.acceptGdpr')} `"
      >
        <template #label>
          <span>
            {{ $t('auth.register.acceptGdpr') }}
            <NuxtLink to="/gdpr" class="text-blue-600 underline ml-1" target="_blank">
              {{ $t('auth.register.readGdpr') }}
            </NuxtLink>
          </span>
        </template>
      </v-checkbox>
      <!-- Newsletter -->
      <v-checkbox
        v-model="acceptNewsletter"
        :label="`${$t('auth.register.acceptNewsletter')} `"
      >
        <template #label>
          <span>
            {{ $t('auth.register.acceptNewsletter') }}
          </span>
        </template>
      </v-checkbox>
      <!--  registring button -->
      <v-btn
        color="primary"
        block
        class="mt-4"
        :loading="loading"
        @click="doRegister"
      >
        {{ $t('auth.register.button') }}
      </v-btn>
      <!--  cancel button  -->
      <div class="mt-4 text-center">
        <NuxtLink to="/login" class="text-sm text-blue-600">
          {{ $t('auth.register.haveAccount') }}
        </NuxtLink>
      </div>
      <!--  error text  -->
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
  const showPassword = ref(false)
  const country = ref('')
  const zip = ref('')
  const city = ref('')
  const street = ref('')
  const phone = ref('')
  const error = ref(null)
  const loading = ref(false)
  const { t } = useI18n()
  const acceptAGB = ref(false)
  const acceptGDPR = ref(false)
  const acceptNewsletter = ref(false)

  // init
  onMounted(() => {
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    psw.value = ''
    country.value = ''
    zip.value = ''
    city.value = ''
    street.value = ''
    phone.value = ''
  })
  // registring
  async function doRegister() {
    // check required fields
    if (
      !firstname.value ||
      !lastname.value ||
      !email.value ||
      !psw.value ||
      !country.value ||
      !zip.value ||
      !city.value ||
      !street.value
    ) {
      error.value = t('auth.register.errors.required')
      return
    }
    // check AGB & GDPR acceptance
    if (!acceptAGB.value || !acceptGDPR.value) {
      error.value = t('auth.register.errors.acceptTerms')
      return
    }
    // subscribe to newsletter if accepted
    if (acceptNewsletter.value) {
      $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: {
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value
        }
      }).catch((err) => {
        console.debug('Newsletter subscription failed:', err)
      })
    }
    // proceed with registration
    loading.value = true
    error.value = null
    const fullAdress = `${country.value}, ${zip.value} ${city.value}, ${street.value}`
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          firstname: firstname.value,
          name: lastname.value,
          email: email.value,
          psw: psw.value,
          adress: fullAdress,
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