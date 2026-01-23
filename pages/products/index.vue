<template>
  <v-container class="py-10">
    <h1 class="text-3xl font-bold mb-6">
      {{ $t('products.title') }}
    </h1>

    <v-row>
      <v-col
        v-for="product in products"
        :key="product._id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="h-100 d-flex flex-column">
          <v-img
            :src="product.cover || '/placeholder.jpg'"
            height="200"
            cover
          />

          <v-card-title class="font-semibold">
            {{ product.title }}
          </v-card-title>

          <v-card-text class="text-body-2">
            {{ product.shortDescription }}
          </v-card-text>

          <v-card-actions class="mt-auto">
            <v-btn
              color="primary"
              @click="goToProduct(product._id)"
            >
              {{ $t('products.viewDetails') }}
            </v-btn>

            <v-btn
              color="success"
              variant="tonal"
              @click="addToCart(product)"
            >
              {{ $t('products.buyFor') }} €{{ product.price }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      v-if="products.length === 0"
      type="info"
      class="mt-10"
    >
      {{ $t('products.noProducts') }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { useProducts } from '~/composables/useProducts'
import { useRouter } from 'vue-router'

const router = useRouter()
const { getProducts, addToCart } = useProducts()

// SSR-safe product loading
const { data: products } = await useAsyncData('products', () => getProducts())

function goToProduct(id) {
  router.push(`/products/${id}`)
}
</script>

<style scoped>
/* optional fine-tuning */
</style>
