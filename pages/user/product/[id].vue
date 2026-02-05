<template>
  <section class="p-6 max-w-4xl mx-auto">

    <div v-if="pending" class="text-gray-500 text-center py-10">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-2">Betöltés...</p>
    </div>
    
    <div v-else-if="error" class="text-red-600">
      <v-alert type="error">Hiba történt az adatok lekérésekor.</v-alert>
    </div>

    <div v-else-if="product && product.title">
      <!-- TERMÉK ALAPADATOK -->
      <h1 class="text-3xl font-bold mb-4">{{ product.title }}</h1>
      <img v-if="product.cover" :src="product.cover" class="w-full max-h-80 object-cover rounded mb-6" />
      <div class="prose max-w-none mb-8" v-html="product.description" />

      <!-- COACHING LOGIKA: TÖBBSZÖRÖS VÁSÁRLÁS KEZELÉSE -->
      <div v-if="product.type === 'coaching'" class="mb-8 border-t pt-6">
        <h2 class="text-2xl font-bold mb-6 flex align-center">
          <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
          Coaching alkalmaim
        </h2>

        <v-card v-for="(p, index) in relevantPurchases" :key="p._id" class="mb-4 pa-4" outlined border elevation="1">
          <v-row align="center">
            <v-col cols="12" sm="7">
              <div class="text-overline">Vásárlás: {{ formatDate(p.createdAt) }}</div>
              
              <!-- Státusz kijelzés -->
              <div v-if="getBooking(p._id)" class="mt-2">
                <v-chip :color="getBookingStatus(getBooking(p._id)).color" dark>
                  <v-icon left size="small">{{ getBookingStatus(getBooking(p._id)).icon }}</v-icon>
                  {{ formatBookingDate(getBooking(p._id).start) }}
                </v-chip>
                <p v-if="getBooking(p._id).completed" class="text-caption success--text mt-1 ml-1">
                  <v-icon size="x-small">mdi-check</v-icon> Teljesítve
                </p>
              </div>
              <v-chip v-else color="warning" variant="tonal" class="mt-2">
                Még nincs időpont foglalva
              </v-chip>
            </v-col>

            <v-col cols="12" sm="5" class="text-right">
              <!-- Foglalás gomb -->
              <v-btn v-if="!getBooking(p._id)" color="primary" @click="openScheduler(p._id)">
                Időpont foglalása
              </v-btn>

              <!-- Módosítás gomb -->
              <div v-else-if="canModify(getBooking(p._id))">
                <v-btn variant="outlined" color="info" size="small" @click="openScheduler(p._id, getBooking(p._id))">
                  <v-icon left size="small">mdi-calendar-edit</v-icon> Időpont módosítása
                </v-btn>
              </div>

              <!-- Teljesített vagy közeli időpont -->
              <div v-else-if="getBooking(p._id).completed" class="text-success font-weight-bold">
                <v-icon color="success">mdi-check-circle</v-icon> Teljesítve
              </div>
              <div v-else class="text-grey text-caption">
                Az időpont már nem módosítható
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- VIDEO -->
      <div v-if="videoUrl" class="mb-8 mt-6">
        <h2 class="text-xl font-semibold mb-4">Oktató videó</h2>
        <div class="w-full aspect-video">
          <iframe :src="videoUrl" class="w-full h-full rounded border-0" allowfullscreen />
        </div>
      </div>
    </div>

    <!-- Üres állapot -->
    <div v-else class="text-center py-10">
      <v-icon size="64" color="grey-lighten-1">mdi-package-variant</v-icon>
      <p class="text-h6 text-grey mt-4">A termék nem található.</p>
    </div>

    <!-- SCHEDULER MODAL -->
    <v-dialog v-model="schedulerOpen" max-width="900px" persistent scrollable>
      <v-card>
        <v-toolbar flat color="primary" dark>
          <v-btn icon @click="schedulerOpen = false"><v-icon>mdi-arrow-left</v-icon></v-btn>
          <v-toolbar-title>Válassz időpontot</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-0">
          <GenericScheduler 
            v-if="schedulerOpen"
            :product-id="product._id"
            :purchase-id="activePurchaseId" 
            :existing-booking="activeBooking"
            @booked="onBookingSuccess" 
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- PDF DOWNLOADS -->
<div v-if="product?.downloadableFiles?.length" class="mb-8 border-t pt-6">
  <h2 class="text-xl font-semibold mb-4 flex align-center">
    <v-icon color="primary" class="mr-2">mdi-file-download</v-icon>
    Letölthető anyagok
  </h2>
  <v-list variant="flat" border class="rounded-lg">
    <v-list-item
      v-for="file in product.downloadableFiles"
      :key="file"
      prepend-icon="mdi-file-pdf-box"
      @click="downloadPdf(file)"
      class="cursor-pointer"
    >
      <v-list-item-title class="text-blue-600 font-weight-medium">
        {{ file }}
      </v-list-item-title>
      <template v-slot:append>
        <v-btn icon="mdi-download" variant="text" size="small"></v-btn>
      </template>
    </v-list-item>
  </v-list>
</div>

  </section>
</template>

<script setup>
const route = useRoute()
const currentPurchaseId = route.params.id

definePageMeta({ middleware: 'auth' })


// 1. ADAT LEKÉRÉS JAVÍTÁSA
// [id].vue - Script setup rész

const { data, pending, error, refresh } = await useAsyncData(
  `user-product-combined-${currentPurchaseId}`, 
  async () => {
    const headers = useRequestHeaders(['cookie'])
    
    // Külön-külön kezeljük le a hívásokat, hogy ha a foglalás még üres, a termék akkor is betöltsön
    const [specificProduct, bookings, allPurchases] = await Promise.allSettled([
      $fetch(`/api/user/product/${currentPurchaseId}`, { headers }),
      $fetch('/api/booking/mybookings', { headers }),
      $fetch('/api/user/purchases', { headers })
    ])
    
    return { 
      // Ha a hívás sikeres (fulfilled), adjuk vissza az értékét, különben üres/null
      purchase: specificProduct.status === 'fulfilled' ? specificProduct.value : null,
      bookings: bookings.status === 'fulfilled' ? bookings.value : [],
      allPurchases: allPurchases.status === 'fulfilled' ? allPurchases.value : []
    }
  }
)


const getArray = (val) => Array.isArray(val) ? val : [];

// 1. A konkrét termék adatai
const product = computed(() => {
  // A logod szerint: data.value.purchase.product-ban van a title
  return data.value?.purchase?.product || {};
});

// 2. Az aktuális vásárlás rekordja
const currentPurchase = computed(() => {
  // A logod szerint: data.value.purchase.purchase-ben van az _id és az items tömb
  return data.value?.purchase?.purchase || null;
});

// 3. Releváns vásárlások szűrése
const relevantPurchases = computed(() => {
  const targetTitle = product.value?.title;
  if (!targetTitle) return [];

  // A logod szerint az összes vásárlás a data.value.allPurchases.purchases tömbben van
  const allList = getArray(data.value?.allPurchases?.purchases);
  
  return allList.filter(p => {
    const items = getArray(p.items);
    // Ellenőrizzük, hogy az items első elemének címe egyezik-e
    return items[0]?.title === targetTitle;
  });
});

// 4. Foglalás keresése
const getBooking = (purchaseId) => {
  // A logod szerint a foglalások közvetlenül a data.value.bookings tömbben vannak
  const bList = getArray(data.value?.bookings);
  return bList.find(b => String(b.purchaseId) === String(purchaseId));
}

const canModify = (booking) => {
  if (!booking || booking.completed) return false
  const bookingDate = new Date(booking.start)
  return bookingDate > new Date(Date.now() + 24 * 60 * 60 * 1000)
}

const getBookingStatus = (booking) => {
  if (booking.completed) return { color: 'success', icon: 'mdi-check-decagram' }
  if (canModify(booking)) return { color: 'primary', icon: 'mdi-calendar-check' }
  return { color: 'grey', icon: 'mdi-calendar-lock' }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('hu-HU') : ''
const formatBookingDate = (d) => d ? new Date(d).toLocaleString('hu-HU', {
  month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
}) : ''

// --- MODAL KEZELÉS ---
const schedulerOpen = ref(false)
const activePurchaseId = ref(null)
const activeBooking = ref(null)

const openScheduler = (purchaseId, booking = null) => {
  activePurchaseId.value = purchaseId
  activeBooking.value = booking
  schedulerOpen.value = true
}

const onBookingSuccess = () => {
  schedulerOpen.value = false
  refresh()
}

// --- VIDEO TOKEN ---
const videoUrl = ref(null)
watch(product, async (newProd) => {
  if (newProd?.videoUrl && !videoUrl.value) {
    try {
      const res = await $fetch('/api/user/video-token', { params: { purchaseId: currentPurchaseId } })
      videoUrl.value = res.url
    } catch (e) {
      console.error("Video token error", e)
    }
  }
}, { immediate: true })

// PDF LETÖLTÉS LOGIKA
async function downloadPdf(file) {
  try {
    const config = useRuntimeConfig()
    // A token kérése a backendtől (vásárlás igazolása)
    const res = await $fetch('/api/user/pdf-token', {
      params: { purchaseId: currentPurchaseId, file }
    })
    
    // A teljes URL összeállítása a backendBase alapján
    const downloadUrl = `${config.public.backendBase}${res.url.replace('/api', '')}`
    
    // Megnyitás új ablakban (vagy közvetlen letöltés)
    window.open(downloadUrl, '_blank')
  } catch (err) {
    console.error('Download error:', err)
    alert('Hiba történt a fájl letöltésekor.')
  }
}
</script>
