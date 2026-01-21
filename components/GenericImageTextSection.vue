<template>
  <section :id="sectionKey" class="py-16">
    <div
      class="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      :class="reverse ? 'md:flex-row-reverse' : ''"
    >
      <!-- IMAGE -->
      <div class="flex justify-center">
        <img
          :src="imageUrl"
          alt="Section image"
          class="rounded-xl shadow-lg max-w-full h-auto"
        />

        <!-- ADMIN: IMAGE UPLOAD -->
        <div v-if="isAdmin" class="mt-4">
          <input type="file" @change="onImageSelected" />
        </div>
      </div>

      <!-- TEXT -->
      <div>
        <h2 class="text-3xl font-bold mb-4 text-center md:text-left">
          {{ localContent.title }}
        </h2>

        <p class="text-xl opacity-80 mb-6 text-center md:text-left">
          <em>{{ localContent.subtitle }}</em>
        </p>

        <div class="space-y-4">
          <p
            v-for="(p, index) in localContent.paragraphs"
            :key="index"
            class="text-lg leading-relaxed"
          >
            {{ p }}
          </p>
        </div>

        <!-- ADMIN: EDITOR TOGGLE -->
        <div v-if="isAdmin" class="mt-6">
          <v-btn color="primary" @click="showEditor = !showEditor">
            {{ showEditor ? 'Close Editor' : 'Edit Section' }}
          </v-btn>
        </div>

        <!-- ADMIN: EDITOR PANEL -->
        <v-form
          v-if="showEditor"
          class="pa-4 mt-4 bg-white rounded-lg shadow"
        >
          <v-text-field v-model="localContent.title" label="Title" />
          <v-text-field v-model="localContent.subtitle" label="Subtitle" />

          <!-- Dynamic paragraphs -->
          <div
            v-for="(p, index) in localContent.paragraphs"
            :key="index"
            class="mb-4"
          >
            <v-textarea
              v-model="localContent.paragraphs[index]"
              :label="'Paragraph ' + (index + 1)"
            />

            <v-btn
              color="error"
              variant="text"
              @click="removeParagraph(index)"
            >
              Delete paragraph
            </v-btn>
          </div>

          <v-btn
            color="secondary"
            class="mb-4"
            @click="addParagraph"
          >
            + Add paragraph
          </v-btn>

          <v-btn
            color="primary"
            class="mt-4"
            @click="saveContent"
          >
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
