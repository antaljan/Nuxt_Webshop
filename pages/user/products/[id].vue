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
      <div v-if="product.downloadableFiles?.length" class="mb-8">
        <h2 class="text-xl font-semibold mb-2">Downloads</h2>
        <ul class="list-disc ml-6">
          <li
            v-for="file in product.downloadableFiles"
            :key="file"
          >
            <button
              class="text-blue-600 hover:underline"
              @click="downloadPdf(file)"
            >
              Download {{ file }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const backend = config.public.backendBase

const purchaseId = route.params.id
const videoUrl = ref(null)

const { data, pending, error } = await useAsyncData(
  `user-product-${purchaseId}`,
  () =>
    $fetch(`${backend}/user/product/${purchaseId}`, {
      credentials: 'include'
    })
)

const product = computed(() => data.value?.product || null)

onMounted(async () => {
  if (product.value?.videoUrl) {
    const res = await $fetch(`${backend}/user/video-token`, {
      params: { purchaseId },
      credentials: 'include'
    })
    videoUrl.value = res.url
  }
})

const downloadPdf = async (file) => {
  const res = await $fetch(`${backend}/user/pdf-token`, {
    params: { file, purchaseId },
    credentials: 'include'
  })
  window.location.href = res.url
}
</script>