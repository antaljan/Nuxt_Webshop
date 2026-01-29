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
  // Ha a purchase-ben van items tömb, vegyük az elsőt
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
  const pdfTokenResponse = await $fetch('/api/user/pdf-token', {
    params: { purchaseId, file }
  })
  window.location.href = pdfTokenResponse.url
}
</script>