<template>
  <div
    class="hero-container w3-display-container w3-opacity-min"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
  >
    <!-- CENTER TEXT -->
    <div class="w3-display-middle hero-text">
      <!-- Desktop -->
      <span class="hero-title w3-hide-small">{{ content.title }}</span><br />
      <span class="hero-subtitle w3-hide-small">{{ content.subtitle }}</span>

      <!-- Mobile -->
      <span class="hero-title-small w3-hide-medium w3-hide-large">{{ content.title }}</span><br />
      <span class="hero-subtitle-small w3-hide-medium w3-hide-large">{{ content.subtitle }}</span>
    </div>

    <!-- CTA -->
    <div
      v-if="content.ctaText"
      class="w3-display-bottomleft w3-padding-large w3-animate-opacity cta-wrapper"
    >
      <a :href="content.ctaLink" class="cta-link">
        {{ content.ctaText }}
      </a>
    </div>
  </div>

  <!-- ADMIN: image upload -->
  <div v-if="isAdmin" class="w3-padding">
    <label>Hero background image:</label>
    <input type="file" @change="onImageSelected" />
  </div>

  <!-- ADMIN: toggle editor -->
  <div v-if="isAdmin" class="w3-padding">
    <v-btn color="primary" @click="showEditor = !showEditor">
      {{ showEditor ? 'Close Editor' : 'Edit Hero Section' }}
    </v-btn>
  </div>

  <!-- ADMIN: editor panel -->
  <v-form v-if="showEditor" class="pa-4 mt-4 editor-panel" elevation="2">
    <v-text-field v-model="content.title" label="Title"></v-text-field>
    <v-text-field v-model="content.subtitle" label="Subtitle"></v-text-field>
    <v-text-field v-model="content.ctaText" label="CTA Text"></v-text-field>
    <v-text-field v-model="content.ctaLink" label="CTA Link"></v-text-field>

    <v-btn color="primary" class="mt-4" @click="saveContent">
      Save Hero Content
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  sectionKey: { type: String, required: true }
})

/* ---------------------------
   LANGUAGE HANDLING
--------------------------- */
const selectedLanguage = ref(document.documentElement.lang || 'hu')

if (process.client) {
  const observer = new MutationObserver(() => {
    selectedLanguage.value = document.documentElement.lang
  })
  observer.observe(document.documentElement, { attributes: true })
}

/* ---------------------------
   AUTH (admin check)
--------------------------- */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

/* ---------------------------
   LOAD CONTENT (SSR + CACHE)
--------------------------- */
const { data, refresh } = await useAsyncData(
  `content-${props.sectionKey}-${selectedLanguage.value}`,
  () => $fetch(`/api/content/${props.sectionKey}/${selectedLanguage.value}`),
  {
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  }
)

const content = ref({
  title: '',
  subtitle: '',
  ctaText: '',
  ctaLink: '',
  backgroundImage: ''
})

watch(
  data,
  () => {
    if (data.value) {
      content.value = { ...data.value }
    }
  },
  { immediate: true }
)

/* ---------------------------
   BACKGROUND IMAGE URL
--------------------------- */
const backgroundUrl = computed(() => {
  if (content.value.backgroundImage) {
    return content.value.backgroundImage.startsWith('http')
      ? content.value.backgroundImage
      : `https://antaligyongyi.hu/api${content.value.backgroundImage}`
  }
  return 'https://antaligyongyi.hu/forestbridge.jpg'
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

    content.value.backgroundImage = response.path + '?t=' + Date.now()
    await refresh()
  } catch (err) {
    console.error('Image upload failed:', err)
  }
}

/* ---------------------------
   SAVE CONTENT
--------------------------- */
async function saveContent() {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${selectedLanguage.value}`, {
      method: 'PUT',
      body: content.value
    })

    await refresh()
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
</script>

<style scoped>
.hero-container {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 600px;
  max-height: 100%;
}
.hero-text {
  white-space: nowrap;
}
.hero-title {
  color: white;
  padding: 12px;
  background: black;
  font-size: 32px;
  font-weight: bold;
}
.hero-subtitle {
  color: white;
  padding: 12px;
  font-size: 28px;
}
.hero-title-small {
  color: white;
  padding: 8px;
  background: black;
  font-size: 16px;
}
.hero-subtitle-small {
  color: white;
  padding: 8px;
  font-size: 14px;
}
.editor-panel {
  background: white;
  border-radius: 8px;
}
.cta-wrapper {
  color: white;
}
.cta-link {
  color: white;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  font-size: 18px;
}
.cta-link:hover {
  background: white;
  color: black;
}
</style>
