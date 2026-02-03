<template>
  <section class="p-10 max-w-4xl mx-auto">

    <h1 class="text-3xl font-bold mb-8">
      {{ isEdit ? t('admin.products.edit') : t('admin.products.new') }}
    </h1>

    <v-form ref="form" v-model="valid" lazy-validation>

      <!-- TITLE -->
      <v-text-field
        v-model="product.title"
        :label="t('products.title')"
        :rules="[v => !!v || t('common.required')]"
        class="mb-4"
      />

      <!-- SHORT DESCRIPTION -->
      <v-text-field
        v-model="product.shortDescription"
        :label="t('products.description')"
        :rules="[v => !!v || t('common.required')]"
        class="mb-4"
      />

      <!-- PRICE -->
      <v-text-field
        v-model="product.price"
        :label="t('admin.products.price')"
        type="number"
        :rules="[v => !!v || t('common.required')]"
        class="mb-4"
      />

      <!-- COVER IMAGE UPLOAD -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">
          {{ t('admin.products.cover') }}
        </label>

        <input type="file" @change="uploadImage" />

        <div v-if="product.cover" class="mt-4">
          <v-img :src="product.cover" height="200" class="rounded-xl" />
        </div>
      </div>

      <!-- PDF UPLOAD -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">
          {{ t('admin.products.uploadPdf') }}
        </label>

        <input type="file" accept="application/pdf" @change="handlePdfUpload" />

        <div v-if="uploadedPdfFilename" class="mt-2 text-green-700">
          {{ uploadedPdfFilename }}
        </div>

        <!-- Existing PDF -->
        <div v-if="isEdit && product.downloadableFiles?.length" class="mt-4">
          <p class="font-semibold">{{ t('admin.products.existingPdfs') }}:</p>
          <ul class="list-disc ml-6">
            <li>{{ product.downloadableFiles[0] }}</li>
          </ul>
        </div>
      </div>

      <!-- VIDEO URL -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">
          {{ t('admin.products.videoUrl') }}
        </label>

        <v-text-field
          v-model="product.videoUrl"
          label="https://iframe.mediadelivery.net/embed/..."
          class="mb-2"
        />
      </div>

      <!--  product type selector -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">Termék típusa</label>
        <v-select
          v-model="product.type"
          :items="[
            { title: 'Digitális (PDF/Video)', value: 'digital' },
            { title: 'Coaching (Időpont foglalós)', value: 'coaching' }
          ]"
          label="Válassz típust"
          variant="outlined"
        />
      </div>

      <!-- FULL DESCRIPTION -->
      <label class="font-semibold block mb-2">
        {{ t('admin.products.fullDescription') }}
      </label>

      <EditorContent :editor="editor" class="border rounded-lg p-4 bg-white" />

      <!-- ACTIONS -->
      <div class="flex gap-4 mt-8">
        <v-btn
          color="blue"
          @click="saveProduct"
          :disabled="!valid"
        >
          {{ isEdit ? t('admin.products.update') : t('admin.products.save') }}
        </v-btn>

        <NuxtLink
          to="/admin/products"
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          {{ t('common.cancel') }}
        </NuxtLink>
      </div>

    </v-form>

  </section>
</template>

<script setup>
import { useRoute, useRouter } from '#imports'
import { useI18n } from 'vue-i18n'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useProductsAdmin } from '~/composables/useProductsAdmin'
import { useAuth } from '~/composables/useAuth'

/* ---------------------------
    I18N
--------------------------- */
const { t } = useI18n()

/* ---------------------------
   AUTH GUARD
--------------------------- */
const { loggedIn, isAdmin } = useAuth()
// SSR guard
if (!loggedIn.value || !isAdmin.value) {
  navigateTo('/login', { replace: true })
}
// Client guard
watchEffect(() => {
  if (!loggedIn.value || !isAdmin.value) {
    navigateTo('/login', { replace: true })
  }
})

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
  videoUrl: '',
  type: 'digital'
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

watch(() => product.description, (newContent) => {
  if (editor.value && editor.value.getHTML() !== newContent) {
    editor.value.commands.setContent(newContent)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

/* ---------------------------
    IMAGE UPLOAD
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
    PDF UPLOAD
--------------------------- */
const uploadedPdfFilename = ref(null)

async function handlePdfUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  // FONTOS: Maradjon 'image', mert a backend ezen a néven várja!
  formData.append('image', file) 

  try {
    const res = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    uploadedPdfFilename.value = res.filename
  } catch (err) {
    console.error('Feltöltési hiba:', err.data?.message || err.message)
    alert('Hiba: ' + (err.data?.message || 'A fájl nem tölthető fel.'));
  }
}




/* ---------------------------
    SAVE PRODUCT
--------------------------- */
async function saveProduct() {
  if (!valid.value) return

  // Klónozzuk a terméket
  const payload = JSON.parse(JSON.stringify(product))
  delete payload._id
  delete payload.createdAt

  // PDF KEZELÉSE: 
  // Csak akkor írjuk felül a tömböt, ha történt új feltöltés
  if (uploadedPdfFilename.value) {
    payload.downloadableFiles = [uploadedPdfFilename.value]
  } else if (isEdit.value) {
    // Szerkesztésnél tartsuk meg a már meglévő fájlokat
    payload.downloadableFiles = product.downloadableFiles || []
  }

  try {
    if (isEdit.value) {
      await admin.updateProduct(productId.value, payload)
    } else {
      await admin.createProduct(payload)
    }
    router.push('/admin/products')
  } catch (err) {
    console.error('Mentési hiba:', err)
  }
}

</script>