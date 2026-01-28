<template>
  <section class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Üdv újra, {{ user?.name || 'Felhasználó' }}!</h1>

    <!-- QUICK LINKS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <NuxtLink
        to="/user/products"
        class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition"
      >
        <h2 class="text-xl font-semibold mb-2">📦 Termékeim</h2>
        <p class="text-gray-600 text-sm">Megvásárolt workshopok, videók, PDF-ek</p>
      </NuxtLink>

      <NuxtLink
        to="/user/profile"
        class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition"
      >
        <h2 class="text-xl font-semibold mb-2">👤 Profilom</h2>
        <p class="text-gray-600 text-sm">Személyes adatok, beállítások</p>
      </NuxtLink>

      <NuxtLink
        to="/logout"
        class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition"
      >
        <h2 class="text-xl font-semibold mb-2">🚪 Kijelentkezés</h2>
        <p class="text-gray-600 text-sm">Biztonságos kijelentkezés</p>
      </NuxtLink>
    </div>

    <!-- RECENT PURCHASES -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Legutóbbi vásárlásaid</h2>

      <div v-if="pending" class="text-gray-500">Betöltés...</div>
      <div v-else-if="error" class="text-red-600">Nem sikerült betölteni a vásárlásokat.</div>
      <div v-else-if="!purchases.length" class="text-gray-500">
        Még nem vásároltál semmit.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="p in purchases.slice(0, 3)"
          :key="p._id"
          class="p-4 border rounded-lg shadow flex gap-4 bg-white"
        >
          <img
            v-if="p.items[0]?.cover"
            :src="p.items[0].cover"
            class="w-24 h-24 object-cover rounded"
          />

          <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ p.items[0].title }}</h3>
            <p class="text-sm text-gray-600">{{ p.items[0].shortDescription }}</p>
            <p class="text-xs text-gray-400 mt-1">
              Vásárolva: {{ new Date(p.createdAt).toLocaleDateString() }}
            </p>

            <NuxtLink
              :to="`/user/product/${p._id}`"
              class="inline-block mt-2 text-blue-600 hover:underline"
            >
              Megnyitás →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const config = useRuntimeConfig()
const { user } = useAuth()

// Client-side guard
definePageMeta({
  middleware: 'auth'
})


// Fetch purchases
const { data, pending, error } = await useAsyncData(
  'dashboard-purchases',
  async () => {
    return await $fetch('/api/user/purchases', {
      headers: useRequestHeaders(['cookie']),
    })
  }
)
const purchases = computed(() => data.value?.purchases || [])

</script>