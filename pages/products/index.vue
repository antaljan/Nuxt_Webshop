<template>
  <v-container class="py-10">
    <NuxtLink to="/" class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4">
      {{ $t('common.backtohome') }}
    </NuxtLink>

    <h1 class="text-3xl font-bold mb-6">{{ $t('products.title') }}</h1>

    <v-row>
      <v-col v-for="product in filteredProducts" :key="product._id" cols="12" sm="6" md="4">
        <v-card class="h-100 d-flex flex-column clickable-card" @click="goToProduct(product._id)">
          
          <v-chip
            v-if="isOwned(product._id)"
            color="success"
            size="small"
            class="absolute top-2 right-2 z-10"
            variant="elevated"
          >
            {{ $t('products.owned') || 'Saját' }}
          </v-chip>

          <v-img :src="product.cover || '/placeholder.jpg'" height="200" contain class="bg-gray-100 rounded-t" />

          <v-card-title class="font-semibold">{{ product.title }}</v-card-title>
          <v-card-text class="text-body-2">{{ product.shortDescription }}</v-card-text>

          <v-card-actions class="mt-auto">
            <v-btn color="primary" @click.stop="goToProduct(product._id)">
              {{ isOwned(product._id) ? $t('products.open') : $t('products.viewDetails') }}
            </v-btn>

            <v-btn
              v-if="!isOwned(product._id)"
              color="success"
              variant="tonal"
              @click.stop="handleAddToCart(product)"
            >
              {{ $t('products.buyFor') }} €{{ product.price }}
            </v-btn>
            
            <v-btn
              v-else
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-play-circle"
              @click.stop="navigateTo(`/user/product/${product._id}`)"
            >
              {{ $t('products.open') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="filteredProducts.length === 0" type="info" class="mt-10">
      {{ $t('products.noProducts') }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { useProducts } from '~/composables/useProducts'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const { getProducts, addToCart } = useProducts()
const { user } = useAuth() // A te auth composable-d

// 1. Terméklista lekérése
const { data: products } = await useAsyncData('products', () => getProducts())

// 2. Vásárolt termékek lekérése
const { data: userPurchasedIds } = await useAsyncData('user-purchased-ids', async () => {
  if (!user.value) return []
  
  try {
    const res = await $fetch('/api/user/purchases', {
      headers: useRequestHeaders(['cookie'])
    })
    
    // Csak a nem-coaching termékek ID-it gyűjtjük
    return res.purchases?.flatMap(p => 
      p.items
        .filter(item => item.type !== 'coaching')
        .map(item => item.productId)
    ) || []
  } catch (e) {
    return []
  }
}, {
  // Ha a user változik (login/logout), frissüljön a lista
  watch: [user]
})

// Szűrés nyelv szerint
const filteredProducts = computed(() => {
  if (!products.value) return []
  return products.value.filter(p => p.language === locale.value)
})

// Helper: Megvan-e már a termék?
const isOwned = (productId) => {
  return userPurchasedIds.value?.includes(productId)
}

function goToProduct(id) {
  if (isOwned(id)) {
    return navigateTo(`/user/product/${id}`)
  }
  return navigateTo(`/products/${id}`)
}

const handleAddToCart = (product) => {
  addToCart(product)
}
</script>