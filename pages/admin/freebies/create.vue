<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/admin/freebies" class="mb-4">
      Vissza a listához
    </v-btn>

    <v-card max-width="600" class="mx-auto pa-6">
      <v-card-title class="text-h5">Új ingyenes anyag feltöltése</v-card-title>
      
      <v-form @submit.prevent="submitForm" v-model="valid">
        <v-text-field
          v-model="form.title"
          label="Cím (pl. Változókor eBook)"
          required
          @input="generateSlug"
        ></v-text-field>

        <v-text-field
          v-model="form.slug"
          label="URL Slug (ékezetek nélkül, kisbetűvel)"
          hint="antaligyongyi.hu/api/public/freebie/download/[slug]"
          required
        ></v-text-field>

        <v-textarea
          v-model="form.description"
          label="Rövid leírás (opcionális)"
        ></v-textarea>

        <v-file-input
          v-model="file"
          label="PDF Fájl kiválasztása"
          accept="application/pdf"
          prepend-icon="mdi-file-pdf-box"
          required
          border
        ></v-file-input>

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          class="mt-6"
          :loading="uploading"
          :disabled="!valid || !file"
        >
          Feltöltés és mentés
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
const router = useRouter()
const valid = ref(false)
const uploading = ref(false)
const file = ref(null)
const form = ref({
  title: '',
  slug: '',
  description: ''
})

// Automatikus slug generálás a címből
const generateSlug = () => {
  form.value.slug = form.value.title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // ékezetek eltávolítása
    .replace(/[^a-z0-0 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

const submitForm = async () => {
  uploading.value = true
  const formData = new FormData()
  formData.append('pdf', file.value)
  // Ha a file.value egy tömb, akkor az első elemet vesszük ki
  //formData.append('pdf', Array.isArray(file.value) ? file.value[0] : file.value)
  formData.append('title', form.value.title)
  formData.append('slug', form.value.slug)
  formData.append('description', form.value.description)

  try {
    await $fetch('/api/freebie/admin/create', { method: 'POST', body: formData })
    router.push('/admin/freebies')
  } catch (e) {
    alert('Hiba a feltöltés során: ' + (e.data?.error || e.message))
  } finally {
    uploading.value = false
  }
}
</script>