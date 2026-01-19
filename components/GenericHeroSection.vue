<template>
  <div
    class="hero-container"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
  >
    <!-- CENTER TEXT -->
    <div class="hero-text">
      <span class="hero-title">{{ content.title }}</span><br />
      <span class="hero-subtitle">{{ content.subtitle }}</span>
    </div>
    <!-- CTA -->
    <div
      v-if="content.ctaText"
      class="cta-wrapper"
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
    <v-text-field v-model="localContent.title" label="Title"></v-text-field>
    <v-text-field v-model="localContent.subtitle" label="Subtitle"></v-text-field>
    <v-text-field v-model="localContent.ctaText" label="CTA Text"></v-text-field>
    <v-text-field v-model="localContent.ctaLink" label="CTA Link"></v-text-field>

    <v-btn color="primary" class="mt-4" @click="saveContent">
      Save Hero Content
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'

/* ---------------------------
   PROPS
--------------------------- */
const props = defineProps({
  content: { type: Object, required: true },
  sectionKey: { type: String, required: false, default: 'hero' }
})

console.log('GenericHeroSection content prop:', props.content)

/* ---------------------------
   AUTH (admin check)
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
    if (val) localContent.value = { ...val }
  },
  { immediate: true }
)


/* ---------------------------
   BACKGROUND IMAGE URL
--------------------------- */
const backgroundUrl = computed(() => {
  const img = localContent.value.backgroundImage
  if (img) {
    return img.startsWith('http')
      ? img
      : `https://antaligyongyi.hu/api${img}`
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

    localContent.value.backgroundImage = response.path + '?t=' + Date.now()
  } catch (err) {
    console.error('Image upload failed:', err)
  }
}

/* ---------------------------
   SAVE CONTENT
--------------------------- */
async function saveContent() {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${document.documentElement.lang}`, {
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
</script>

<style scoped>
.hero-container {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 600px;
  max-height: 100%;
  opacity: 0.8;
}
.hero-text {
  white-space: nowrap;
  text-align: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  position: absolute;
  align-self: auto;
  bottom: 55%;
  left: 20px;
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
