<template>
  <section class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Your Products</h1>

    <div v-if="pending" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-600">
      Failed to load your purchases.
    </div>

    <div v-else-if="!purchases.length" class="text-gray-500">
      You have not purchased any products yet.
    </div>

    <div v-else class="grid gap-6">
      <div
          v-for="p in purchases"
          :key="p._id"
          class="border rounded-lg shadow p-4 flex gap-4"
        >
          <img
          v-if="p.items[0]?.cover"
          :src="p.items[0].cover"
          class="w-32 h-32 object-cover rounded"
        />

        <div class="flex-1">
          <h2 class="text-xl font-semibold">
            {{ p.items[0].title }}
          </h2>

          <p class="text-sm text-gray-600">
            {{ p.items[0].shortDescription }}
          </p>

          <p class="text-xs text-gray-400 mt-1">
            Purchased: {{ new Date(p.createdAt).toLocaleDateString() }}
          </p>

          <NuxtLink
            :to="`/user/product/${p._id}`"
            class="inline-block mt-3 text-blue-600 hover:underline"
          >
            Open product
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

// Fetch purchases using proxy endpoint
const { data, pending, error } = await useAsyncData(
  'user-products',
  async () => {
    return await $fetch('/api/user/purchases', {
      headers: useRequestHeaders(['cookie'])
    })
  }
)

const purchases = computed(() => data.value?.purchases || [])
</script>