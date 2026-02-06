<script setup>
const email = ref('');
const sent = ref(false);

const handleForgot = async () => {
  await $fetch(`${useRuntimeConfig().public.backendBase}/user/forgot-password`, {
    method: 'POST',
    body: { email: email.value }
  });
  sent.value = true;
};
</script>

<template>
  <v-container>
    <v-card v-if="!sent" class="mx-auto mt-10" max-width="400">
      <v-card-title>Jelszó emlékeztető</v-card-title>
      <v-card-text>
        <v-text-field v-model="email" label="E-mail cím" type="email" />
        <v-btn color="primary" block @click="handleForgot">Link küldése</v-btn>
      </v-card-text>
    </v-card>
    <v-alert v-else type="success" class="mt-10 mx-auto" max-width="400">
      Az e-mailt elküldtük! Ellenőrizd a fiókodat.
    </v-alert>
  </v-container>
</template>
