<template>
  <section class="p-10 max-w-4xl mx-auto">

    <h1 class="text-3xl font-bold mb-8">
      {{ isEdit ? 'Edit Product' : 'Create New Product' }}
    </h1>

    <v-form ref="form" v-model="valid" lazy-validation>

      <!-- TITLE -->
      <v-text-field
        v-model="product.title"
        label="Title"
        :rules="[v => !!v || 'Title is required']"
        class="mb-4"
      />

      <!-- SHORT DESCRIPTION -->
      <v-text-field
        v-model="product.shortDescription"
        label="Short Description"
        :rules="[v => !!v || 'Short description is required']"
        class="mb-4"
      />

      <!-- PRICE -->
      <v-text-field
        v-model="product.price"
        label="Price (€)"
        type="number"
        :rules="[v => !!v || 'Price is required']"
        class="mb-4"
      />

      <!-- COVER IMAGE UPLOAD -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">Cover Image</label>

        <input type="file" @change="uploadImage" />

        <div v-if="product.cover" class="mt-4">
          <v-img :src="product.cover" height="200" class="rounded-xl" />
        </div>
      </div>

      <!-- PDF UPLOAD -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">Upload PDF (optional)</label>

        <input type="file" accept="application/pdf" @change="handlePdfUpload" />

        <div v-if="uploadedPdfFilename" class="mt-2 text-green-700">
          Uploaded: {{ uploadedPdfFilename }}
        </div>

        <!-- Existing PDFs in edit mode -->
        <div v-if="isEdit && product.downloadableFiles?.length" class="mt-4">
          <p class="font-semibold">Existing PDF files:</p>
          <ul class="list-disc ml-6">
            <li v-for="file in product.downloadableFiles" :key="file">
              {{ file }}
            </li>
          </ul>
        </div>
      </div>

      <!-- VIDEO URL (Bunny) -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">Video URL (Bunny Stream)</label>

        <v-text-field
          v-model="product.videoUrl"
          label="https://iframe.mediadelivery.net/embed/..."
          class="mb-2"
        />

        <p class="text-sm text-gray-500">
          Paste the Bunny embed URL here.
          Example: https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID
        </p>
      </div>

      <!-- FULL DESCRIPTION -->
      <label class="font-semibold block mb-2">Full Description</label>
      <EditorContent :editor="editor" class="border rounded-lg p-4 bg-white" />

      <!-- ACTIONS -->
      <div class="flex gap-4 mt-8">
        <v-btn
          color="blue"
          @click="saveProduct"
          :disabled="!valid"
        >
          {{ isEdit ? 'Update Product' : 'Create Product' }}
        </v-btn>

        <NuxtLink
          to="/admin/products"
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </NuxtLink>
      </div>

    </v-form>

  </section>
</template>

<script setup>
import { useRoute, useRouter } from '#imports'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useProductsAdmin } from '~/composables/useProductsAdmin'
import { useAuth } from '~/composables/useAuth'

/* ---------------------------
    ADMIN GUARD (SSR + client)
--------------------------- */
const { isAdmin, loggedIn } = useAuth()

if (!loggedIn.value || !isAdmin.value) {
  navigateTo('/login')
}

/* ---------------------------
    ROUTE + ROUTER
--------------------------- */
const route = useRoute()
const router = useRouter()

/* ---------------------------
    ADMIN PRODUCT COMPOSABLE
--------------------------- */
const admin = useProductsAdmin()

/* ---------------------------
    EDIT MODE?
--------------------------- */
const isEdit = computed(() => !!route.query.edit)
const productId = computed(() => route.query.edit)

/* ---------------------------
    FORM STATE
--------------------------- */
const valid = ref(false)

const product = reactive({
  title: '',
  shortDescription: '',
  description: '',
  cover: '',
  price: '',
  downloadableFiles: [],
  videoUrl: ''
})

/* ---------------------------
    LOAD EXISTING PRODUCT
--------------------------- */
if (isEdit.value) {
  const { data } = await useAsyncData(
    `admin-edit-product-${productId.value}`,
    () => admin.getProduct(productId.value)
  )

  if (data.value) {
    Object.assign(product, data.value)
  }
}

/* ---------------------------
    TIPTAP EDITOR
--------------------------- */
const editor = ref(null)

onMounted(() => {
  editor.value = new Editor({
    content: product.description,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      product.description = editor.getHTML()
    }
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

/* ---------------------------
    IMAGE UPLOAD (PUBLIC)
--------------------------- */
async function uploadImage(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  const res = await $fetch(`${backendBase}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })

  product.cover = `${backendBase}${res.path}`
}

/* ---------------------------
    PDF UPLOAD (PRIVATE)
--------------------------- */
const uploadedPdfFilename = ref(null)

async function handlePdfUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  const res = await $fetch(`${backendBase}/upload/pdf`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })

  uploadedPdfFilename.value = res.filename
}

/* ---------------------------
    SAVE PRODUCT
--------------------------- */
async function saveProduct() {
  if (!valid.value) return

  const payload = { ...product }
  delete payload._id
  delete payload.createdAt

  // PDF hozzáadása
  if (uploadedPdfFilename.value) {
    payload.downloadableFiles = [uploadedPdfFilename.value]
  }

  if (isEdit.value) {
    await admin.updateProduct(productId.value, payload)
  } else {
    await admin.createProduct(payload)
  }

  router.push('/admin/products')
}
</script>