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

        <div
          class="text-body-1 mb-6 prose max-w-none"
          v-html="product.description"
        ></div>

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
useHead(() => {
  const p = product.value || {}

  return {
    title: p.title,
    meta: [
      // Alap meta
      { name: 'description', content: p.shortDescription || p.description?.slice(0, 160) },

      // Open Graph (Facebook, LinkedIn)
      { property: 'og:title', content: p.title },
      { property: 'og:description', content: p.shortDescription },
      { property: 'og:type', content: 'product' },
      { property: 'og:image', content: p.cover },
      { property: 'og:url', content: `https://YOUR_DOMAIN/products/${p._id}` },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: p.title },
      { name: 'twitter:description', content: p.shortDescription },
      { name: 'twitter:image', content: p.cover }
    ],

    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title,
          image: p.cover,
          description: p.shortDescription,
          sku: p._id,
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: p.price,
            availability: "https://schema.org/InStock"
          }
        })
      }
    ]
  }
})

function goBack() {
  router.push('/products')
}
</script>

<style scoped>
/* optional fine-tuning */
</style>
