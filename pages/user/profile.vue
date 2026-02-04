<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card :loading="pending" elevation="2" class="pa-4">
          <v-card-title class="text-h5 mb-4">
            <v-icon start icon="mdi-account-cog" color="primary" />
            {{ $t('user.profile') }}
          </v-card-title>

          <v-form @submit.prevent="updateProfile">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.firstname"
                  :label="$t('auth.register.firstname')"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.name"
                  :label="$t('auth.register.lastname')"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="form.email"
              :label="$t('auth.register.email')"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <v-text-field
              v-model="form.phone"
              :label="$t('auth.register.phone')"
              variant="outlined"
              density="comfortable"
            />

            <v-textarea
              v-model="form.adress"
              :label="$t('auth.register.adress')"
              variant="outlined"
              density="comfortable"
              rows="3"
              prepend-inner-icon="mdi-map-marker"
            />

            <v-divider class="my-6" />

            <div class="d-flex justify-end gap-2">
              <v-btn
                color="primary"
                type="submit"
                :loading="saving"
                prepend-icon="mdi-check"
              >
                {{ $t('common.save') }}
              </v-btn>
            </div>
          </v-form>
        </v-card>

        <!-- Üzenet visszajelzés -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
          {{ snackbar.text }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { user } = useAuth()
const saving = ref(false)
const snackbar = reactive({ show: false, text: '', color: '' })

// Reaktív űrlap adatok
const form = reactive({
  id: '',
  firstname: '',
  name: '',
  email: '',
  phone: '',
  adress: ''
})

// Adatok lekérése kényszerített frissítéssel
const { data: profileData, pending, error } = await useAsyncData(
  'user-profile',
  () => $fetch('/api/auth/me', {
    headers: useRequestHeaders(['cookie'])
  }),
  {
    // Biztosítjuk, hogy ne csak cache-ből olvasson
    initialCache: false 
  }
)

// Segédfüggvény az adatok bemásolásához
const syncForm = (data) => {
  // A logod alapján az adat a data.user alatt van!
  const userData = data?.user || data 
  
  if (userData) {
    form.id = userData._id || userData.id
    form.firstname = userData.firstname || ''
    form.name = userData.name || ''
    form.email = userData.email || ''
    form.phone = userData.phone || ''
    form.adress = userData.adress || ''
  }
}

// Azonnali szinkronizáció, ha már van adat (SSR után)
if (profileData.value) {
  syncForm(profileData.value)
}

// Biztonsági mentés: ha a kliens oldalon frissülne az adat
watch(profileData, (newData) => {
  syncForm(newData)
}, { immediate: true })

// Ellenőrizzük a konzolon, mi jön meg
onMounted(() => {
  if (error.value) console.error('Fetch error:', error.value)
})

async function updateProfile() {
  saving.value = true
  try {
    await $fetch('/api/users/update', {
      method: 'POST',
      body: { id: form.id, ...form },
      headers: useRequestHeaders(['cookie'])
    })
    
    snackbar.text = 'Profil sikeresen frissítve!'
    snackbar.color = 'success'
    snackbar.show = true
  } catch (err) {
    snackbar.text = 'Hiba történt a mentés során.'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    saving.value = false
  }
}
</script>

