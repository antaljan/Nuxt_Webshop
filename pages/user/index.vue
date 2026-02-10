<template>
  <section class="p-8 max-w-4xl mx-auto">
    <!--  back to home  -->
    <NuxtLink
      to="/"
      class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      {{ $t('common.backtohome') }}
    </NuxtLink>
    <!--  title  -->
    <h1 class="text-3xl font-bold mb-6">{{ $t('user.welcome') }}, {{ user?.name || $t('common.user') }}!</h1>
    <!-- my products  -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <NuxtLink to="/user/products" class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition border border-gray-100">
        <h2 class="text-xl font-semibold mb-2">📦 {{ $t('user.products') }}</h2>
        <p class="text-gray-600 text-sm">{{ $t('user.productsDescription') }}</p>
      </NuxtLink>
    <!-- my profile  -->
      <NuxtLink to="/user/profile" class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition border border-gray-100">
        <h2 class="text-xl font-semibold mb-2">👤 {{ $t('user.profile') }}</h2>
        <p class="text-gray-600 text-sm">{{ $t('user.profileDescription') }}</p>
      </NuxtLink>
    <!-- logout  -->
      <NuxtLink to="/logout" class="p-6 rounded-xl shadow bg-white hover:bg-gray-50 transition border border-gray-100">
        <h2 class="text-xl font-semibold mb-2">🚪 {{ $t('header.logout') }}</h2>
        <p class="text-gray-600 text-sm">Biztonságos kijelentkezés</p>
      </NuxtLink>
    </div>
    <!-- list of bookings  -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold">📅 {{ $t('common.bookings') }}</h2>
        <!--<v-btn to="/coaching" variant="text" color="primary" size="small">Új foglalás</v-btn>-->
      </div>
      <v-card variant="outlined" class="rounded-xl overflow-hidden">
        <v-progress-linear v-if="bookingsPending" indeterminate color="primary" />
        <v-table v-if="bookings?.length">
          <thead>
            <tr>
              <th class="text-left">{{ $t('common.termin') }}</th>
              <th class="text-left">{{ $t('common.type') }}</th>
              <th class="text-right">{{ $t('common.command') }}</th>
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
                  {{ $t('common.canceling') }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
        <div v-else-if="!bookingsPending" class="p-8 text-center text-gray-500">
          {{ $t('common.noBookings') }}
        </div>
      </v-card>
    </div>
  </section>
</template>

<script setup>

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { user } = useAuth()
const { getMyBookings, cancelSlot } = useCoaching()
const cancellingId = ref(null)

definePageMeta({
  middleware: 'auth'
})

// Load bookings
const { data: rawBookings, pending: bookingsPending, refresh: refreshBookings } = await useAsyncData(
  'user-bookings',
  () => getMyBookings()
)
const bookings = computed(() =>
  (rawBookings.value || []).filter(b => !b.completed) 
)

// Load purchases
const { data: purchaseData, pending, error } = await useAsyncData(
  'dashboard-purchases',
  () => $fetch('/api/user/purchases', { headers: useRequestHeaders(['cookie']) })
)
const purchases = computed(() => purchaseData.value?.purchases || [])

// Handle cancel booking
async function handleCancel(id) {
  if (!confirm('Biztosan lemondod ezt az időpontot?')) return
  cancellingId.value = id
  try {
    await cancelSlot(id)
    await refreshBookings()
  } catch (e) {
    alert('Hiba történt a lemondás során.')
  } finally {
    cancellingId.value = null
  }
}

</script>