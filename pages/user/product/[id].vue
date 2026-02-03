<template>
  <section class="p-6 max-w-4xl mx-auto">
    <div v-if="pending" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-600">Failed to load product.</div>
    <div v-else-if="!product" class="text-gray-500">Product not found.</div>

    <div v-else>
      <h1 class="text-3xl font-bold mb-4">{{ product.title }}</h1>

      <img
        v-if="product.cover"
        :src="product.cover"
        class="w-full max-h-80 object-cover rounded mb-6"
      />

      <div
        class="prose max-w-none mb-8"
        v-html="product.description"
      />

      <!-- VIDEO -->
      <div v-if="videoUrl" class="mb-8">
        <h2 class="text-xl font-semibold mb-2">Video</h2>
        <div class="w-full aspect-video">
          <iframe
            :src="videoUrl"
            class="w-full h-full rounded"
            allowfullscreen
          />
        </div>
      </div>

      <!-- PDF DOWNLOADS -->
      <div v-if="product?.downloadableFiles?.length" class="mb-8">
        <h2 class="text-xl font-semibold mb-2">Letölthető anyagok</h2>
          <v-list variant="flat" border>
            <v-list-item
              v-for="file in product.downloadableFiles"
              :key="file"
              prepend-icon="mdi-file-pdf-box"
              @click="downloadPdf(file)"
              class="cursor-pointer"
            >
              <v-list-item-title class="text-blue-600">{{ file }}</v-list-item-title>
            </v-list-item>
          </v-list>
      </div>

      <!-- Coaching  -->
      <div v-if="product?.type === 'coaching'" class="mb-8 border-t pt-6">
        <h2 class="text-2xl font-bold mb-4 flex align-center">
          <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
            Időpont foglalása
        </h2>
  
        <v-alert v-if="hasBooking" type="success" variant="tonal" class="mb-4">
          Már van lefoglalt időpontod ehhez a termékhez: 
          <strong>{{ formatBookingDate(userBooking.start) }}</strong>
        </v-alert>

        <div v-else>
          <p class="mb-4 text-gray-600">Válassz egy szabad időpontot a naptárban a konzultációhoz:</p>
          <GenericScheduler v-if="product.type === 'coaching'" :product-id="product._id" />
        </div>
      </div>


    </div>
  </section>
</template>

<script setup>
const route = useRoute()
const purchaseId = route.params.id

definePageMeta({
  middleware: 'auth'
})

// Product data
const { data, pending, error } = await useAsyncData(
  `user-product-${purchaseId}`,
  () =>
    $fetch(`/api/user/product/${purchaseId}`, {
      headers: useRequestHeaders(['cookie'])
    })
)

const product = computed(() => {
  const purchase = data.value?.product || data.value;
  return purchase?.items ? purchase.items[0] : purchase;
});

// VIDEO TOKEN
const videoUrl = ref(null)
onMounted(async () => {
  if (product.value?.videoUrl) {
    const videoTokenResponse = await $fetch('/api/user/video-token', {
      params: { purchaseId }
    })
    videoUrl.value = videoTokenResponse.url
  }
})

// PDF DOWNLOAD
async function downloadPdf(file) {
  try {
    const config = useRuntimeConfig()
    const res = await $fetch('/api/user/pdf-token', {
      params: { purchaseId, file }
    })
    
    const downloadUrl = `${config.public.backendBase}${res.url.replace('/api', '')}`
    
    window.open(downloadUrl, '_blank')
  } catch (err) {
    console.error('Download error:', err)
  }
}


const { getAvailableSlots } = useCoaching() // inser Composable

// bookins status handler
const userBooking = ref(null)
const hasBooking = computed(() => !!userBooking.value)

// chceking the bookings of user for this product
async function checkUserBooking() {
  // A backend summary-ból vagy egy dedikált végpontról lekérjük
  // Feltételezve, hogy a 'data.value' tartalmazza a vásárláshoz kapcsolt foglalást
  if (data.value?.booking) {
    userBooking.value = data.value.booking
  }
}

onMounted(() => {
  checkUserBooking()
})

function onBookingSuccess() {
  refreshNuxtData(`user-product-${purchaseId}`)
}

function formatBookingDate(date) {
  return new Date(date).toLocaleString('hu-HU', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
</script>