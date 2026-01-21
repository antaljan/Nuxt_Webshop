<template>
  <v-container class="py-10 text-center">
    <h1 class="text-3xl font-bold mb-4">
      {{ $t('checkout.cancelTitle') }}
    </h1>
    <p class="mb-6">
      {{ $t('checkout.cancelText') }}
    </p>
    <v-btn color="primary" @click="goBackToProducts">
      {{ $t('checkout.backToProducts') }}
    </v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBackToProducts() {
  router.push('/products')
}
</script>
