<template>
  <v-container class="py-10">
    <v-row>
      <!-- Product Image -->
      <v-col cols="12" md="6">
        <v-img
          :src="product.cover"
          height="400"
          cover
          class="rounded-lg"
        />
      </v-col>

      <!-- Product Info -->
      <v-col cols="12" md="6">
        <h1 class="text-3xl font-bold mb-4">
          {{ product.title }}
        </h1>

        <p class="text-body-1 mb-6">
          {{ product.description }}
        </p>

        <div class="text-2xl font-semibold mb-6">
          €{{ product.price }}
        </div>

        <v-btn
          color="success"
          size="large"
          @click="addToCart(product)"
        >
          {{ $t('products.buyFor') }} €{{ product.price }}
        </v-btn>

        <v-btn
          class="ml-4"
          variant="tonal"
          @click="goBack"
        >
          {{ $t('products.backToList') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useProducts } from '~/composables/useProducts'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '#imports'

const route = useRoute()
const router = useRouter()
const { getProduct, addToCart } = useProducts()

// SSR-safe product loading
const { data: product } = await useAsyncData(
  `product-${route.params.id}`,
  () => getProduct(route.params.id)
)

// SEO meta tags
useHead({
  title: product.value?.title || 'Product',
  meta: [
    {
      name: 'description',
      content: product.value?.shortDescription || ''
    }
  ]
})

function goBack() {
  router.push('/products')
}
</script>

<style scoped>
/* optional fine-tuning */
</style>
