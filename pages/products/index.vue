<template>
  <v-container class="py-10">
    <!--  back to home  -->
    <NuxtLink
      to="/"
      class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      {{ $t('common.backtohome') }}
    </NuxtLink>
    <!--  Title  -->
    <h1 class="text-3xl font-bold mb-6">
      {{ $t('products.title') }}
    </h1>
    <!--  Product List  -->
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
            contain
            class="bg-gray-100 rounded-t"
          ></v-img>

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
              @click="handleAddToCart(product)"
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
// Emeljük ki a cart-ot is, hogy lássuk a változást
const { getProducts, addToCart, cart } = useProducts()

const { data: products } = await useAsyncData('products', () => getProducts())

function goToProduct(id) {
  return navigateTo(`/products/${id}`)
}

// Opcionális: Logoljuk, ha valami bekerül
const handleAddToCart = (product) => {
  console.log('Adding to cart:', product.title)
  addToCart(product)
  //alert(`${product.title} a kosárba került!`)
}
</script>


<style scoped>
/* optional fine-tuning */
</style>
