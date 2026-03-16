<template>
  <section class="p-6 max-w-4xl mx-auto">
    <!--  back to user dashboard  -->
    <NuxtLink
      to="/user"
      class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      {{ $t('products.backToDashboard') }}
    </NuxtLink>
    <!-- 1. LOADING -->
    <div v-if="pending" class="text-gray-500 text-center py-10">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-2">{{ $t('products.loading') }}</p>
    </div>
    <!-- 2. ERROR -->
    <div v-else-if="error" class="text-red-600">
      <v-alert type="error">{{ $t('products.error') }}</v-alert>
    </div>
    <!-- 3. PRODUCT CONTENT (Minden ide tartozik) -->
    <div v-else-if="product && product.title">
      <!-- TERMÉK ALAPADATOK -->
      <h1 class="text-3xl font-bold mb-4">{{ product.title }}</h1>
      <v-img v-if="product.cover" :src="product.cover" class="w-full max-h-80 object-cover rounded mb-6" />
      <div class="prose max-w-none mb-8" v-html="product.description" />
<!-- COACHING LOGIKA -->
<div v-if="product.type === 'coaching'" class="mb-8 border-t pt-6">
  <h2 class="text-2xl font-bold mb-6 flex align-center">
    <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
    {{ $t('products.coachingSessions') }}
  </h2>

  <!-- 🔥 ITEM-SZINTŰ LISTA -->
  <v-card
    v-for="item in relevantItems"
    :key="item.purchaseId + '-' + item._id"
    class="mb-4 pa-4"
    outlined
    border
    elevation="1"
  >
    <v-row align="center">
      <v-col cols="12" sm="7">
        <div class="text-overline">
          {{ $t('products.purchaseDetails') }} {{ formatDate(item.purchasedAt) }}
        </div>

        <!-- Foglalás -->
        <div v-if="getBookingForItem(item)" class="mt-2">
          <v-chip
            :color="getBookingStatus(getBookingForItem(item)).color"
            dark
            size="small"
          >
            <v-icon left size="small">
              {{ getBookingStatus(getBookingForItem(item)).icon }}
            </v-icon>
            {{ formatBookingDate(getBookingForItem(item).start) }}
          </v-chip>

          <p
            v-if="getBookingForItem(item).completed"
            class="text-caption text-success mt-1 ml-1"
          >
            <v-icon size="x-small">mdi-check</v-icon>
            {{ $t('common.completed') }}
          </p>
        </div>

        <v-chip
          v-else
          color="warning"
          variant="tonal"
          class="mt-2"
          size="small"
        >
          {{ $t('common.noBooking') }}
        </v-chip>
      </v-col>

      <v-col cols="12" sm="5" class="text-right">
        <!-- Foglalás gomb -->
        <v-btn
          v-if="!getBookingForItem(item)"
          color="primary"
          @click="openScheduler(item.purchaseId, item._id)"
        >
          {{ $t('common.booking') }}
        </v-btn>

        <!-- Módosítás -->
        <div v-else-if="canModify(getBookingForItem(item))">
          <v-btn
            variant="outlined"
            color="info"
            size="small"
            @click="openScheduler(item.purchaseId, item._id, getBookingForItem(item))"
          >
            <v-icon left size="small">mdi-calendar-edit</v-icon>
            {{ $t('common.edit') }}
          </v-btn>
        </div>

        <!-- Completed -->
        <div
          v-else-if="getBookingForItem(item).completed"
          class="text-success font-weight-bold"
        >
          <v-icon color="success">mdi-check-circle</v-icon>
          {{ $t('common.completed') }}
        </div>

        <!-- Locked -->
        <div v-else class="text-grey text-caption">
          {{ $t('common.bookingClosed') }}
        </div>
      </v-col>
    </v-row>
  </v-card>
</div>

      <!-- VIDEO SZEKCIÓ -->
      <div v-if="videoUrl || loadingVideo" class="mb-8 border-t pt-6">
        <v-card class="mx-auto" max-width="900" elevation="10">
          <v-card-title class="bg-primary text-white">{{ $t('common.video') }}</v-card-title>     
          <div style="position:relative;padding-top:56.25%;">
            <iframe
              v-if="videoUrl"
              :src="videoUrl"
              loading="lazy"
              style="border:none;position:absolute;top:0;left:0;width:100%;height:100%;"
              allowfullscreen="true"
            ></iframe>
            <div v-else class="absolute inset-0 d-flex align-center justify-center bg-grey-lighten-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </div>
        </v-card>
      </div>

      <!-- PDF DOWNLOADS -->
      <div v-if="product?.downloadableFiles?.length" class="mb-8 border-t pt-6">
        <h2 class="text-xl font-semibold mb-4 flex align-center">
          <v-icon color="primary" class="mr-2">mdi-file-download</v-icon>
          {{ $t('common.downloadableFiles') }}
        </h2>
        <v-list variant="flat" border class="rounded-lg">
          <v-list-item
            v-for="file in product.downloadableFiles"
            :key="file"
            prepend-icon="mdi-file-pdf-box"
            @click="downloadPdf(file)"
            class="cursor-pointer"
          >
            <v-list-item-title class="text-blue-600 font-weight-medium">{{ file }}</v-list-item-title>
            <template v-slot:append>
              <v-btn icon="mdi-download" variant="text" size="small"></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div> <!-- END PRODUCT CONTENT -->

    <!-- 4. NOT FOUND -->
    <v-alert v-else type="warning" class="mt-10">
      {{ $t('products.errorMissing') }}
    </v-alert>

    <!-- SCHEDULER MODAL -->
    <v-dialog v-model="schedulerOpen" max-width="900px" persistent scrollable>
      <v-card>
        <v-toolbar flat color="primary" dark>
          <v-btn icon @click="schedulerOpen = false"><v-icon>mdi-close</v-icon></v-btn>
          <v-toolbar-title>{{ $t('common.schedulerTitle') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-0">
          <GenericScheduler
            v-if="schedulerOpen"
            :product-id="product._id"
            :purchase-id="activePurchaseId"
            :item-id="activeItemId"
            :existing-booking="activeBooking"
            @booked="onBookingSuccess"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useProducts } from '~/composables/useProducts'
const { t } = useI18n()
const { getProduct } = useProducts()

definePageMeta({ middleware: 'auth' })

// -----------------------------
// 1) ROUTE PARAM → productId
// -----------------------------
const route = useRoute()
const productId = route.params.id   // <-- MOSTANTÓL TERMÉK ID

// -----------------------------
// 2) ADATOK LEKÉRÉSE
// -----------------------------
const { data, pending, error, refresh } = await useAsyncData(
  `user-product-${productId}`,
  async () => {
    const headers = useRequestHeaders(['cookie'])

const [product, bookings, allPurchases] = await Promise.allSettled([
  getProduct(productId),
  $fetch('/api/booking/mybookings', { headers }),
  $fetch('/api/user/purchases', { headers })
])

    return {
      product: product.status === 'fulfilled' ? product.value : null,
      bookings: bookings.status === 'fulfilled' ? bookings.value : [],
      allPurchases: allPurchases.status === 'fulfilled' ? allPurchases.value : []
    }
  }
)

const getArray = (val) => Array.isArray(val) ? val : []

// -----------------------------
// 3) TERMÉK ADATOK
// -----------------------------
const product = computed(() => data.value?.product || {})

// -----------------------------
// 4) ITEM-SZINTŰ LISTA (csak ehhez a termékhez)
// -----------------------------
const relevantItems = computed(() => {
  const allPurchases = getArray(data.value?.allPurchases?.purchases)

  // Flatten: minden item külön elem
  const flattened = allPurchases.flatMap(purchase =>
    purchase.items.map(item => ({
      ...item,
      purchaseId: purchase._id,
      purchasedAt: purchase.createdAt
    }))
  )

  // Csak az adott termékhez tartozó itemek
  return flattened.filter(item =>
    String(item.productId) === String(productId)
  )
})

// -----------------------------
// 5) BOOKING ITEM-SZINTEN
// -----------------------------
const getBookingForItem = (item) => {
  const bList = getArray(data.value?.bookings)
  return bList.find(b =>
    String(b.purchaseId) === String(item.purchaseId) &&
    String(b.itemId) === String(item._id)
  )
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
const formatBookingDate = (d) =>
  d
    ? new Date(d).toLocaleString('hu-HU', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : ''

// -----------------------------
// 6) SCHEDULER MODAL
// -----------------------------
const schedulerOpen = ref(false)
const activePurchaseId = ref(null)
const activeBooking = ref(null)
const activeItemId = ref(null)

const openScheduler = (purchaseId, itemId, booking = null) => {
  activePurchaseId.value = purchaseId
  activeItemId.value = itemId
  activeBooking.value = booking
  schedulerOpen.value = true
}

const onBookingSuccess = () => {
  schedulerOpen.value = false
  refresh()
}

// -----------------------------
// 7) VIDEO TOKEN
// -----------------------------
const videoUrl = ref(null)
const loadingVideo = ref(false)

watch(
  [product, relevantItems],
  async ([newProd, newItems]) => {
    // Csak akkor futunk le, ha van videó URL a termékleírásban és vannak megvett példányok
    if (newProd?.videoUrl && newItems?.length > 0 && !videoUrl.value) {
      loadingVideo.value = true
      try {
        // Keressük meg azt a konkrét vásárolt itemet, amihez tartozik videó URL
        const videoItem = newItems.find(item => item.videoUrl !== null) || newItems[0]

        const res = await $fetch('/api/user/video-token', {
          query: {
            purchaseId: String(videoItem.purchaseId),
            itemId: String(videoItem._id)
          }
        })
        
        if (res.url) {
          videoUrl.value = res.url
        }
      } catch (e) {
        console.error('Video token error:', e)
      } finally {
        loadingVideo.value = false
      }
    }
  },
  { immediate: true, deep: true }
)

// -----------------------------
// 8) PDF LETÖLTÉS
// -----------------------------
async function downloadPdf(file) {
  try {
    const config = useRuntimeConfig()
    
    // Keressük meg a megfelelő purchaseItem-et (ahogy korábban beszéltük)
    const purchaseItem = relevantItems.value.find(item => 
      item.downloadableFiles && item.downloadableFiles.includes(file)
    ) || relevantItems.value[0]

    if (!purchaseItem) {
      alert('Nincs érvényes vásárlás ehhez a fájlhoz.')
      return
    }

    // Használjunk 'query' kulcsot 'params' helyett
    const res = await $fetch('/api/user/pdf-token', {
      query: {
        purchaseId: String(purchaseItem.purchaseId), 
        file: file
      }
    })

    const downloadUrl = `${config.public.backendBase}${res.url.replace('/api', '')}`
    window.open(downloadUrl, '_blank')
  } catch (err) {
    console.error('Download error:', err)
    alert('Hiba történt a fájl letöltésekor.')
  }
}
</script>
