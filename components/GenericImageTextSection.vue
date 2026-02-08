<template>
<section :id="sectionKey" class="py-12">
  <div
    class="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
    :class="reverse ? 'md:flex-row-reverse' : ''"
  >

    <!-- IMAGE -->
    <div class="flex justify-center md:justify-start">
      <img
        :src="imageUrl"
        alt="Section image"
        class="rounded-lg shadow max-w-sm w-full h-auto"
      />

      <div v-if="isAdmin" class="mt-3">
        <input type="file" @change="onImageSelected" />
      </div>
    </div>

    <!-- TEXT -->
    <div class="md:pl-4">

      <!-- TITLE -->
      <h2 class="text-2xl font-semibold text-center md:text-left mb-4">
        {{ localContent.title }}
      </h2>

      <!-- SUBTITLE -->
      <p class="text-base opacity-80 text-center md:text-left mb-4 leading-snug">
        <em>{{ localContent.subtitle }}</em>
      </p>

      <!-- PARAGRAPHS -->
      <div class="space-y-3">
        <p
          v-for="(p, index) in localContent.paragraphs"
          :key="index"
          class="text-base leading-snug"
        >
          {{ p }}
        </p>
      </div>

      <!-- CTA -->
      <div v-if="localContent.ctaText" class="mt-5 text-center md:text-left">
        <a
          :href="localContent.ctaLink"
          class="inline-block bg-primary text-white hover:opacity-90 transition px-5 py-2.5 rounded-md text-base font-medium shadow-sm"
        >
          {{ localContent.ctaText }}
        </a>
      </div>

      <!-- ADMIN TOGGLE -->
      <div v-if="isAdmin" class="mt-6">
        <v-btn color="primary" @click="showEditor = !showEditor">
          {{ showEditor ? 'Close Editor' : 'Edit Section' }}
        </v-btn>
      </div>

      <!-- ADMIN EDITOR -->
      <v-form
        v-if="showEditor"
        class="pa-4 mt-4 rounded-lg shadow"
        color="background"
      >
        <v-text-field v-model="localContent.title" label="Title" />
        <v-text-field v-model="localContent.subtitle" label="Subtitle" />

        <div
          v-for="(p, index) in localContent.paragraphs"
          :key="index"
          class="mb-4"
        >
          <v-textarea
            v-model="localContent.paragraphs[index]"
            :label="'Paragraph ' + (index + 1)"
          />
          <v-btn color="error" variant="text" @click="removeParagraph(index)">
            Delete paragraph
          </v-btn>
        </div>

        <v-text-field v-model="localContent.ctaText" label="CTA Text" />
        <v-text-field v-model="localContent.ctaLink" label="CTA Link" />

        <v-btn color="secondary" class="mb-4" @click="addParagraph">
          + Add paragraph
        </v-btn>

        <v-btn color="primary" class="mt-4" @click="saveContent">
          Save Content
        </v-btn>
      </v-form>

    </div>
  </div>
</section>

</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

/* ---------------------------
   PROPS
--------------------------- */
const props = defineProps({
  content: { type: Object, required: true },
  sectionKey: { type: String, required: true },
  reverse: { type: Boolean, default: false }
})

/* ---------------------------
   AUTH
--------------------------- */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

/* ---------------------------
   LOCAL COPY OF CONTENT
--------------------------- */
const localContent = ref({})
watch(
  () => props.content,
  (val) => {
    if (val) localContent.value = structuredClone(val)
  },
  { immediate: true }
)

/* ---------------------------
   BACKEND BASE URL
--------------------------- */
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

/* ---------------------------
   IMAGE URL
--------------------------- */
const imageUrl = computed(() => {
  const img = localContent.value.image
  if (!img) return '/fallback.jpg'

  if (img.startsWith('http')) return img

  const normalized = img.startsWith('/') ? img : `/${img}`
  return `${backendBase}${normalized}`
})

/* ---------------------------
   IMAGE UPLOAD
--------------------------- */
async function onImageSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await $fetch('/api/content/upload', {
      method: 'POST',
      body: formData
    })

    localContent.value.image = response.path + '?t=' + Date.now()
  } catch (err) {
    console.error('Image upload failed:', err)
  }
}

/* ---------------------------
   PARAGRAPH CONTROLS
--------------------------- */
function addParagraph() {
  localContent.value.paragraphs.push('')
}

function removeParagraph(index) {
  localContent.value.paragraphs.splice(index, 1)
}

/* ---------------------------
   SAVE CONTENT
--------------------------- */
const { locale } = useI18n()

async function saveContent() {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
      method: 'PUT',
      body: localContent.value
    })
    alert('Content saved!')
  } catch (err) {
    console.error('Saving content failed:', err)
    alert('Error saving content')
  }
}

/* ---------------------------
   ADMIN EDITOR TOGGLE
--------------------------- */
const showEditor = ref(false)
</script>
