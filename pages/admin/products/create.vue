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

      <!-- IMAGE UPLOAD -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">Cover Image</label>

        <input type="file" @change="uploadImage" />

        <div v-if="product.cover" class="mt-4">
          <v-img :src="product.cover" height="200" class="rounded-xl" />
        </div>
      </div>

      <!-- CONTENT (FULL DESCRIPTION) -->
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

/* ---------------------------
    ADMIN GUARD
--------------------------- */
const { isAdmin, loggedIn } = useAuth()

onMounted(() => {
  if (!loggedIn.value) return navigateTo('/login')
  if (!isAdmin.value) return navigateTo('/')
})

watch([loggedIn, isAdmin], () => {
  if (!loggedIn.value || !isAdmin.value) navigateTo('/')
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
    body: formData
  })

  product.cover = res.url
}

/* ---------------------------
    SAVE PRODUCT
--------------------------- */
async function saveProduct() {
  if (!valid.value) return

  if (isEdit.value) {
    await admin.updateProduct(productId.value, product)
  } else {
    await admin.createProduct(product)
  }

  router.push('/admin/products')
}
</script>
