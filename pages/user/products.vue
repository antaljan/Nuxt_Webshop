<template>
  <section class="p-6 max-w-4xl mx-auto">
    <NuxtLink
      to="/user"
      class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      {{ $t('products.backToDashboard') }}
    </NuxtLink>

    <h1 class="text-3xl font-bold mb-6">{{ $t('products.yourproducts') }}</h1>

    <div v-if="pending" class="text-gray-500">{{ $t('products.loading') }}</div>
    <div v-else-if="error" class="text-red-600">{{ $t('products.error') }}</div>

    <div v-else-if="!purchases.length" class="text-gray-500">
      {{ $t('products.noProducts') }}
    </div>

    <div v-else class="grid gap-6">
      <div
        v-for="p in purchases"
        :key="p.purchaseId + '-' + p._id"
        class="border rounded-lg shadow p-4 flex gap-4"
      >
        <img
          v-if="p.cover"
          :src="p.cover"
          class="w-32 h-32 object-cover rounded"
        />

        <div class="flex-1">
          <h2 class="text-xl font-semibold">{{ p.title }}</h2>

          <p class="text-sm text-gray-600">{{ p.shortDescription }}</p>

          <p class="text-xs text-gray-400 mt-1">
            Purchased: {{ new Date(p.purchasedAt).toLocaleDateString() }}
          </p>

          <NuxtLink
            :to="`/user/product/${p.purchaseId}`"
            class="inline-block mt-3 text-blue-600 hover:underline"
          >
            {{ $t('products.open') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

definePageMeta({ middleware: 'auth' })

const { data, pending, error } = await useAsyncData(
  'user-products',
  async () => {
    return await $fetch('/api/user/purchases', {
      headers: useRequestHeaders(['cookie'])
    })
  }
)

const purchases = computed(() => {
  const rawList = data.value?.purchases || []

  // 1) Flatten: minden item külön kártya
  const flattened = rawList.flatMap(purchase =>
    purchase.items.map(item => ({
      ...item,
      purchaseId: purchase._id,
      purchasedAt: purchase.createdAt
    }))
  )

  // 2) Coaching deduplikálása
  const coaching = []
  const seenCoaching = new Set()

  flattened.forEach(item => {
    if (item.type === 'coaching') {
      if (!seenCoaching.has(item._id)) {
        seenCoaching.add(item._id)
        coaching.push(item)
      }
    }
  })

  // 3) Digitális termékek (NINCS deduplikálás!)
  const digital = flattened.filter(item => item.type !== 'coaching')

  // 4) Végső lista
  return [...coaching, ...digital]
})
</script>
