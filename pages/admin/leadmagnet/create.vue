<script setup>
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from '#imports'

import SectionBuilder from '@/components/admin/leadmagnet/SectionBuilder.vue'
import GenericHeroSection from '@/components/GenericHeroSection.vue'
import GenericImageTextSection from '@/components/GenericImageTextSection.vue'
import GenericTextSection from '@/components/GenericTextSection.vue'
import GenericFeedbackSection from '@/components/GenericFeedbackSection.vue'
import GenericContactSection from '@/components/GenericContactSection.vue'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: "",
  slug: "",
  language: "hu",
  newsletterTag: "",
  freebieSlug: "",
  seoTitle: "",
  seoDescription: "",
  sections: []
})

// Freebie lista betöltése
const { data: freebieList } = await useFetch('/api/freebie/admin/list')

// EDIT mód → betöltés
if (isEdit.value) {
  const { data } = await useFetch(`/api/leadmagnet/${route.params.id}`)
  if (data.value?.item) {
    Object.assign(form, data.value.item)
  }
}

// Mentés
const save = async () => {
  if (isEdit.value) {
    await $fetch(`/api/leadmagnet/update/${route.params.id}`, {
      method: 'PUT',
      body: form
    })
  } else {
    await $fetch('/api/leadmagnet/create', {
      method: 'POST',
      body: form
    })
  }
  router.push('/admin/leadmagnet')
}

// Link másolás
const copyLink = () => {
  const url = `${window.location.origin}/leadmagnet/${form.slug}`
  navigator.clipboard.writeText(url)
}

// Preview komponens választó
const resolveComponent = (type) => {
  switch (type) {
    case 'hero': return GenericHeroSection
    case 'text': return GenericTextSection
    case 'imageText': return GenericImageTextSection
    case 'feedback': return GenericFeedbackSection
    case 'contact': return GenericContactSection
    default: return null
  }
}
</script>

<template>
  <v-container>
    <h1 class="mb-6">
      {{ isEdit ? 'Lead Magnet szerkesztése' : 'Új Lead Magnet létrehozása' }}
    </h1>

    <!-- Alap mezők -->
    <v-text-field v-model="form.title" label="Cím" class="mb-4" />
    <v-text-field v-model="form.slug" label="Slug" class="mb-4" />
    <v-select
      v-model="form.language"
      :items="['hu','de','en']"
      label="Nyelv"
      class="mb-4"
    />
    <v-text-field
      v-model="form.newsletterTag"
      label="Newsletter tag"
      class="mb-4"
    />

    <!-- Freebie választó -->
    <v-select
      v-if="freebieList"
      v-model="form.freebieSlug"
      :items="freebieList"
      item-title="title"
      item-value="slug"
      label="Freebie kiválasztása"
      class="mb-6"
    />

    <!-- SEO mezők -->
    <v-text-field
      v-model="form.seoTitle"
      label="SEO Title"
      class="mb-4"
    />
    <v-textarea
      v-model="form.seoDescription"
      label="Meta Description"
      class="mb-6"
    />

    <!-- Section builder -->
    <SectionBuilder v-model="form.sections" class="mb-10" />

    <!-- Mentés -->
    <v-btn color="primary" class="mr-4" @click="save">Mentés</v-btn>

    <!-- Link másolás (csak edit módban) -->
    <v-btn
      v-if="isEdit"
      color="secondary"
      @click="copyLink"
    >
      Link másolása
    </v-btn>

    <!-- Preview -->
    <h2 class="mt-12 mb-4">Előnézet</h2>

    <div class="preview-wrapper pa-6">
      <component
        v-for="(section, i) in form.sections"
        :key="i"
        v-if="section && section.type && resolveComponent(section.type)"
        :is="resolveComponent(section.type)"
        v-bind="section.props"
      />
    </div>
  </v-container>
</template>

<style scoped>
.preview-wrapper {
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
