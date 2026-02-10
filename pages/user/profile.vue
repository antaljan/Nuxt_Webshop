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

                <v-btn
                  variant="outlined"
                  color="secondary"
                  prepend-icon="mdi-close"
                  @click="handleCancel"
                >
                  {{ $t('common.cancel') }}
                </v-btn>

                <v-btn
                  variant="text"
                  color="error"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete"
                >
                  {{ $t('user.deleteAccount') }}
                </v-btn>
              </div>
          </v-form>
        </v-card>

        <!-- User profile delete dialog -->
        <v-dialog v-model="deleteDialog" max-width="480">
          <v-card>
            <v-card-title class="text-h6">
              {{ $t('user.deleteAccountConfirm') }}
            </v-card-title>

            <v-card-text>
              {{ $t('user.deleteAccountConfirmText') }}

              <p v-if="deleteError" class="text-red-600 mt-2 text-sm">
                {{ deleteError }}
              </p>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn variant="text" @click="deleteDialog = false">
                {{ $t('common.cancel') }}
              </v-btn>

              <v-btn
                color="error"
                :loading="deleting"
                @click="handleDelete"
              >
                {{ $t('user.deleteAccountConfirmButton') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


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
const router = useRouter()


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

// ÚJ: törlés dialógus + állapotok
const deleteDialog = ref(false)
const deleting = ref(false)
const deleteError = ref('')

// Cancel → vissza dashboardra
const handleCancel = () => {
  router.push('/user')
}

// Törlés megerősítés megnyitása
const confirmDelete = () => {
  deleteDialog.value = true
}

// Profil törlése
const handleDelete = async () => {
  deleting.value = true
  deleteError.value = ''

  try {
    // meglévő proxy endpointod
    await $fetch('/api/admin/user/delete', {
      method: 'POST',
      body: { id: form.id },
      headers: useRequestHeaders(['cookie'])
    })

    // logout
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null

    router.push('/')
  } catch (err) {
    deleteError.value = 'Hiba történt a profil törlésekor.'
  } finally {
    deleting.value = false
    deleteDialog.value = false
  }
}

</script>

