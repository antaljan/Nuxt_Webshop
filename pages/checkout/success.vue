<template>
  <v-container class="py-10 text-center">
    <h1 class="text-3xl font-bold mb-4">
      {{ $t('checkout.successTitle') }}
    </h1>
    <p class="mb-6">
      {{ $t('checkout.successText') }}
    </p>
    <v-btn color="primary" @click="goToDashboard">
      {{ $t('checkout.goToDashboard') }}
    </v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useProducts } from '~/composables/useProducts'

const router = useRouter()
const { clearCart } = useProducts()

onMounted(() => {
  // sikeres fizetés után ürítjük a kosarat
  clearCart()
})

function goToDashboard() {
  router.push('/user')
}
</script>
