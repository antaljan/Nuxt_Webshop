<template>
  <v-container class="py-10" max-width="400">

    <!-- MAINTENANCE MODE: REGISTRATION DISABLED -->
    <v-card
      v-if="settings?.maintenanceMode"
      class="pa-6 text-center"
    >
      <h2 class="text-h5 mb-4">{{ $t('auth.register.disabledTitle') }}</h2>
      <p class="mb-4">{{ $t('auth.register.disabledText') }}</p>

      <NuxtLink to="/login" class="text-blue-600 underline">
        {{ $t('auth.register.goToLogin') }}
      </NuxtLink>
    </v-card>

    <!-- NORMAL REGISTRATION FORM -->
    <v-card v-else class="pa-6">
      <h2 class="text-h5 mb-4">{{ $t('auth.register.title') }}</h2>

      <!-- first name -->
      <v-text-field
        v-model="firstname"
        :label="$t('auth.register.firstname')"
        variant="outlined"
      />

      <!-- last name -->
      <v-text-field
        v-model="lastname"
        :label="$t('auth.register.lastname')"
        variant="outlined"
      />

      <!-- email -->
      <v-text-field
        v-model="email"
        :label="$t('auth.register.email')"
        type="email"
        variant="outlined"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />

      <!-- password -->
      <v-text-field
        v-model="psw"
        :label="$t('auth.register.password')"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        autocomplete="new-password"
      />

      <!-- address -->
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

      <!-- phone -->
      <v-text-field
        v-model="phone"
        :label="$t('auth.register.phone')"
        variant="outlined"
      />

      <!-- AGB -->
      <v-checkbox v-model="acceptAGB">
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
      <v-checkbox v-model="acceptGDPR">
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
      <v-checkbox v-model="acceptNewsletter">
        <template #label>
          <span>{{ $t('auth.register.acceptNewsletter') }}</span>
        </template>
      </v-checkbox>

      <!-- register button -->
      <v-btn
        color="primary"
        block
        class="mt-4"
        :loading="loading"
        @click="doRegister"
      >
        {{ $t('auth.register.button') }}
      </v-btn>

      <!-- cancel -->
      <div class="mt-4 text-center">
        <NuxtLink to="/login" class="text-sm text-blue-600">
          {{ $t('auth.register.haveAccount') }}
        </NuxtLink>
      </div>

      <!-- error -->
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBrand } from '@/composables/useBrand'

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
const acceptAGB = ref(false)
const acceptGDPR = ref(false)
const acceptNewsletter = ref(false)

const { t } = useI18n()

// BRAND SETTINGS FOR MAINTENANCE MODE
const { settings, loadBrand } = useBrand()
await loadBrand()

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

async function doRegister() {
  if (settings.value?.maintenanceMode) {
    error.value = t('auth.register.disabledText')
    return
  }

  // required fields
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

  // AGB & GDPR
  if (!acceptAGB.value || !acceptGDPR.value) {
    error.value = t('auth.register.errors.acceptTerms')
    return
  }

  // newsletter
  if (acceptNewsletter.value) {
    $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        language: $i18n.locale || 'en'
      }
    }).catch(() => {})
  }

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
        rolle: 'user',
        language: $i18n.locale || 'en'
      }
    })
    navigateTo('/')
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
