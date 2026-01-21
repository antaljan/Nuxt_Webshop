<template>
<section :id="sectionKey" class="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
  <div
    class="absolute inset-0 bg-cover bg-center will-change-transform parallax-bg"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
    ref="parallax"
  ></div>

  <div class="relative z-10 flex items-center justify-center h-full text-center px-4">
    <div class="max-w-3xl">
      <h1 class="text-white font-bold text-3xl md:text-5xl mb-4 leading-tight">
        {{ content.title }}
      </h1>
      <p class="text-white text-lg md:text-2xl opacity-90 mb-6">
        {{ content.subtitle }}
      </p>
      <div v-if="content.ctaText">
        <a
          :href="content.ctaLink"
          class="inline-block bg-white/20 hover:bg-white text-white transition px-6 py-3 rounded-lg text-lg font-medium backdrop-blur-sm hover:!text-black"
        >
          {{ content.ctaText }}
        </a>
      </div>
    </div>
  </div>
</section>

  <!-- ADMIN TOOLS (marad) -->
  <div v-if="isAdmin" class="p-4">
    <label>Hero background image:</label>
    <input type="file" @change="onImageSelected" />
  </div>

  <div v-if="isAdmin" class="p-4">
    <v-btn color="primary" @click="showEditor = !showEditor">
      {{ showEditor ? 'Close Editor' : 'Edit Hero Section' }}
    </v-btn>
  </div>

  <v-form v-if="showEditor" class="pa-4 mt-4 editor-panel" elevation="2">
    <v-text-field v-model="localContent.title" label="Title" />
    <v-text-field v-model="localContent.subtitle" label="Subtitle" />
    <v-text-field v-model="localContent.ctaText" label="CTA Text" />
    <v-text-field v-model="localContent.ctaLink" label="CTA Link" />

    <v-btn color="primary" class="mt-4" @click="saveContent">
      Save Hero Content
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

/* ---------------------------
   PROPS
--------------------------- */
const props = defineProps({
  content: { type: Object, required: true },
  sectionKey: { type: String, required: true }
})


/* ---------------------------
   AUTH (admin check)
--------------------------- */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

/* ---------------------------
   LOCAL COPY OF CONTENT
--------------------------- */
const localContent = ref({
  title: '',
  subtitle: '',
  ctaText: '',
  ctaLink: '',
  image: ''
})
watch(
  () => props.content,
  (val) => {
    if (val) localContent.value = { ...localContent.value, ...val }
  },
  { immediate: true }
)


/* ---------------------------
   BACKGROUND IMAGE URL
--------------------------- */
const backgroundUrl = computed(() => {
  const img = localContent.value.image
  if (!img) return '/fallbackImages.jpg'

  // Ha teljes URL → hagyjuk
  if (img.startsWith('http')) return img

  // Ha relatív → backendBase + path
  return `${backendBase}${img.startsWith('/') ? img : '/' + img}`
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

  localContent.value.image = `${response.path}?t=${Date.now()}`
  } catch (err) {
    console.error('Image upload failed:', err)
  }
}

/* ---------------------------
   SAVE CONTENT
--------------------------- */
async function saveContent() {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
      method: 'PUT',
      body: localContent.value
    })
    alert('Hero content saved!')
  } catch (err) {
    console.error('Saving hero content failed:', err)
    alert('Error saving hero content')
  }
}

/* ---------------------------
   ADMIN EDITOR TOGGLE
--------------------------- */
const showEditor = ref(false)


/* ---------------------------
   Parallax Effect
--------------------------- */
const parallax = ref(null) 
onMounted(() => {
  const handler = () => {
    if (!parallax.value) return
    const rect = parallax.value.getBoundingClientRect()
    const offset = rect.top * -0.3
    parallax.value.style.transform = `translateY(${offset}px)`
  }
  window.addEventListener('scroll', handler)
  onUnmounted(() => {
    window.removeEventListener('scroll', handler)
  })
})


</script>

<style scoped>
  .hero-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.editor-panel {
  background: white;
  border-radius: 8px;
}
.parallax-bg {
  transform: scale(1.1);
  transform-origin: center;
  background-size: cover; 
  background-position: center; 
  will-change: transform;
}

</style>