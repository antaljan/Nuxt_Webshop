<template>
  <section class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Üdv újra, {{ user?.name || 'Felhasználó' }}!</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <NuxtLink to="/user/products" class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition border border-gray-100">
        <h2 class="text-xl font-semibold mb-2">📦 Termékeim</h2>
        <p class="text-gray-600 text-sm">Megvásárolt workshopok, videók, PDF-ek</p>
      </NuxtLink>

      <NuxtLink to="/user/profile" class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition border border-gray-100">
        <h2 class="text-xl font-semibold mb-2">👤 Profilom</h2>
        <p class="text-gray-600 text-sm">Személyes adatok, beállítások</p>
      </NuxtLink>

      <NuxtLink to="/logout" class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition border border-gray-100">
        <h2 class="text-xl font-semibold mb-2">🚪 Kijelentkezés</h2>
        <p class="text-gray-600 text-sm">Biztonságos kijelentkezés</p>
      </NuxtLink>
    </div>

    <div class="mb-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold">📅 Foglalt időpontjaim</h2>
        <v-btn to="/coaching" variant="text" color="primary" size="small">Új foglalás</v-btn>
      </div>

      <v-card variant="outlined" class="rounded-xl overflow-hidden">
        <v-progress-linear v-if="bookingsPending" indeterminate color="primary" />
        
        <v-table v-if="bookings?.length">
          <thead>
            <tr>
              <th class="text-left">Időpont</th>
              <th class="text-left">Típus</th>
              <th class="text-right">Művelet</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in bookings" :key="b._id">
              <td class="font-medium">
                {{ new Date(b.start).toLocaleString('hu-HU', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
              </td>
              <td>{{ b.title }}</td>
              <td class="text-right">
                <v-btn
                  color="error"
                  variant="tonal"
                  size="x-small"
                  :loading="cancellingId === b._id"
                  @click="handleCancel(b._id)"
                >
                  Lemondás
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        
        <div v-else-if="!bookingsPending" class="p-8 text-center text-gray-500">
          Nincs aktív foglalásod.
        </div>
      </v-card>
    </div>

    <div>
      <h2 class="text-2xl font-semibold mb-4">Legutóbbi vásárlásaid</h2>

      <div v-if="pending" class="text-gray-500 italic">Vásárlások betöltése...</div>
      <div v-else-if="error" class="text-red-600">Nem sikerült betölteni a vásárlásokat.</div>
      <div v-else-if="!purchases.length" class="p-8 border rounded-xl text-center text-gray-500 bg-gray-50">
        Még nem vásároltál semmit.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="p in purchases.slice(0, 3)"
          :key="p._id"
          class="p-4 border rounded-xl shadow-sm flex gap-4 bg-white items-center"
        >
          <img
            v-if="p.items[0]?.cover"
            :src="p.items[0].cover"
            class="w-20 h-20 object-cover rounded-lg"
          />

          <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ p.items[0].title }}</h3>
            <p class="text-xs text-gray-400 mt-1">
              Dátum: {{ new Date(p.createdAt).toLocaleDateString('hu-HU') }}
            </p>

            <NuxtLink
              :to="`/user/product/${p._id}`"
              class="inline-block mt-2 text-blue-600 hover:underline text-sm font-medium"
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
const { user } = useAuth()
const { getMyBookings, cancelSlot } = useCoaching()
const cancellingId = ref(null)

definePageMeta({
  middleware: 'auth'
})

// Foglalások betöltése
const { data: bookings, pending: bookingsPending, refresh: refreshBookings } = await useAsyncData(
  'user-bookings',
  () => getMyBookings()
)

// Vásárlások betöltése
const { data: purchaseData, pending, error } = await useAsyncData(
  'dashboard-purchases',
  () => $fetch('/api/user/purchases', { headers: useRequestHeaders(['cookie']) })
)
const purchases = computed(() => purchaseData.value?.purchases || [])

// Lemondás kezelése
async function handleCancel(id) {
  if (!confirm('Biztosan lemondod ezt az időpontot?')) return
  
  cancellingId.value = id
  try {
    await cancelSlot(id)
    await refreshBookings() // Lista frissítése
  } catch (e) {
    alert('Hiba történt a lemondás során.')
  } finally {
    cancellingId.value = null
  }
}
</script>