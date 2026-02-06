<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="400">
      <v-card-title>Új jelszó megadása</v-card-title>
      <v-card-text>
        <v-text-field v-model="password" label="Új jelszó" type="password" />
        <v-btn color="primary" @click="handleReset" :loading="loading">Mentés</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const route = useRoute();
const password = ref('');
const loading = ref(false);
const { $toast } = useNuxtApp(); // Ha használsz toast-ot

const handleReset = async () => {
  loading.value = true;
  try {
    await $fetch(`${useRuntimeConfig().public.backendBase}/user/reset-password`, {
      method: 'POST',
      body: { 
        token: route.query.token, 
        newPassword: password.value 
      }
    });
    navigateTo('/login');
  } catch (e) {
    alert('Hiba történt vagy a link lejárt.');
  } finally {
    loading.value = false;
  }
};
</script>
