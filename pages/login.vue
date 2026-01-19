<template>
  <v-container class="py-10" max-width="400">
    <v-card class="pa-6">
      <v-text-field v-model="email" label="Email" />
      <v-text-field v-model="psw" label="Password" type="password" />

      <v-btn color="primary" block class="mt-4" @click="doLogin">
        Login
      </v-btn>

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

const { login } = useAuth()

async function doLogin() {
  try {
    const route = useRoute()
    const redirect = route.query.redirect || '/'
    await login(email.value, psw.value)
    navigateTo(redirect)
  } catch (e) {
    error.value = 'Invalid credentials'
  }
}
</script>
