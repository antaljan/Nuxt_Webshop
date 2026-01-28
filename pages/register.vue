<template>
  <v-container class="py-10" max-width="400">
    <v-card class="pa-6">
      <h2 class="text-h5 mb-4">Regisztráció</h2>
      <v-text-field v-model="email" label="Email" type="email" />
      <v-text-field v-model="psw" label="Jelszó" type="password" />
      
      <v-btn color="primary" block class="mt-4" :loading="loading" @click="doRegister">
        Regisztráció
      </v-btn>

      <div class="mt-4 text-center">
        <NuxtLink to="/login" class="text-sm text-blue-600">Már van fiókom, belépek</NuxtLink>
      </div>

      <v-alert v-if="error" type="error" class="mt-4">
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

const { register } = useAuth()

async function doRegister() {
  if (!email.value || !psw.value) {
    error.value = 'Kérlek tölts ki minden mezőt!'
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    await register(email.value, psw.value)
    // Regisztráció után irány a kezdőlap vagy a korábbi redirect URL
    const route = useRoute()
    const redirect = route.query.redirect || '/'
    navigateTo(redirect)
  } catch (e) {
    error.value = 'Hiba történt a regisztráció során. Lehet, hogy ez az email már foglalt?'
  } finally {
    loading.value = false
  }
}
</script>
