<template>
  <section
    v-if="contentReady"
    :id="sectionKey"
    class="relative w-full overflow-hidden flex items-center justify-center text-center"
    :style="{ height: heroHeight }"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-no-repeat will-change-transform parallax-bg"
      :style="{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundPosition: localContent.backgroundPosition,
      }"
      ref="parallax"
    ></div>

    <!-- Overlay -->
    <div
      class="absolute inset-0"
      :style="{
        backgroundColor: localContent.overlayColor,
        opacity: localContent.overlayOpacity,
      }"
    ></div>

    <!-- TEXT CONTENT -->
    <div class="relative z-10 px-4 max-w-3xl">
      <div v-html="sanitizedHtml" class="prose prose-invert max-w-none"></div>

<a
  v-if="localContent.ctaText && localContent.ctaText.trim() !== ''"
  :href="localContent.ctaLink"
  class="inline-block transition px-6 py-3 rounded-lg text-lg font-medium backdrop-blur-sm"
  :style="{
    backgroundColor: hovering ? localContent.ctaHoverBgColor : localContent.ctaBgColor,
    color: hovering ? localContent.ctaHoverTextColor : localContent.ctaTextColor
  }"
  @mouseover="hovering = true"
  @mouseleave="hovering = false"
>
  {{ localContent.ctaText }}
</a>


    </div>
  </section>

  <!-- ADMIN TOOLS -->
  <div v-if="isAdmin" class="p-4 mt-6 border rounded-lg bg-gray-50">
    <h3 class="font-semibold mb-4">Hero szerkesztése</h3>

    <!-- Editor toggle buttons -->
    <div class="flex gap-4 mb-4">
      <v-btn
        class="admin-primary"
        @click="showContentEditor = !showContentEditor"
      >
        {{ showContentEditor ? 'Tartalom bezárása' : 'Tartalom szerkesztése' }}
      </v-btn>

      <v-btn
        class="admin-secondary"
        @click="showDesignEditor = !showDesignEditor"
      >
        {{ showDesignEditor ? 'Design bezárása' : 'Design szerkesztése' }}
      </v-btn>
    </div>

    <!-- CONTENT EDITOR -->
    <div v-if="showContentEditor" class="mt-4 p-4 bg-white rounded-lg shadow">

      <!-- TOOLBAR -->
      <div class="flex flex-wrap gap-2 mb-4 items-center bg-gray-50 p-2 rounded-lg border">

        <v-btn icon size="small" variant="text"
          @click="editor?.chain().focus().toggleBold().run()"
          :color="editor?.isActive('bold') ? 'primary' : ''">
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn icon size="small" variant="text"
          @click="editor?.chain().focus().toggleItalic().run()"
          :color="editor?.isActive('italic') ? 'primary' : ''">
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn icon size="small" variant="text" @click="editor?.chain().focus().undo().run()">
          <v-icon>mdi-undo</v-icon>
        </v-btn>

        <v-btn icon size="small" variant="text" @click="editor?.chain().focus().redo().run()">
          <v-icon>mdi-redo</v-icon>
        </v-btn>

        <v-select class="w-32" density="compact" hide-details
          :items="fontSizes" label="Méret"
          prepend-inner-icon="mdi-format-size"
          @update:modelValue="size => editor?.chain().focus().setFontSize(size).run()" />

        <v-select class="w-40" density="compact" hide-details
          :items="fontFamilies" label="Betűtípus"
          prepend-inner-icon="mdi-format-font"
          @update:modelValue="family => editor?.chain().focus().setFontFamily(family).run()" />

        <div class="relative flex items-center">
          <v-btn icon size="small" variant="text">
            <v-icon>mdi-format-color-text</v-icon>
          </v-btn>
          <input
            type="color"
            class="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer"
            @input="e => editor?.chain().focus().setColor(e.target.value).run()"
          />
        </div>

      </div>

      <!-- EDITOR CONTENT -->
      <div class="editor-wrapper border rounded-lg p-3 bg-white min-h-[300px]">
        <EditorContent v-if="editor" :editor="editor" />
      </div>

      <!-- CTA FIELDS -->
      <v-text-field v-model="localContent.ctaText" label="CTA Text" class="mt-4" />
      <v-text-field v-model="localContent.ctaLink" label="CTA Link" />

      <v-btn class="admin-primary mt-4" @click="saveContent">
        Tartalom mentése
      </v-btn>
    </div>

    <!-- DESIGN EDITOR -->
    <div v-if="showDesignEditor" class="mt-4 p-4 bg-white rounded-lg shadow">
      <div class="mt-4">
        <label class="font-medium">Háttérkép:</label>
        <input type="file" @change="onImageSelected" />
      </div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- OVERLAY COLOR PICKER -->
        <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
          <input
            type="color"
            v-model="localContent.overlayColor"
            class="w-10 h-8 border rounded cursor-pointer"
          />
          <span class="text-xs text-gray-500 font-mono">
            Overlay szín: {{ localContent.overlayColor }}
          </span>
        </div>

        <!-- CTA BUTTON COLORS -->
<div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
  <input
    type="color"
    v-model="localContent.ctaBgColor"
    class="w-10 h-8 border rounded cursor-pointer"
  />
  <span class="text-xs text-gray-500 font-mono">
    CTA háttér: {{ localContent.ctaBgColor }}
  </span>
</div>

<div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
  <input
    type="color"
    v-model="localContent.ctaTextColor"
    class="w-10 h-8 border rounded cursor-pointer"
  />
  <span class="text-xs text-gray-500 font-mono">
    CTA szöveg: {{ localContent.ctaTextColor }}
  </span>
</div>

<div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
  <input
    type="color"
    v-model="localContent.ctaHoverBgColor"
    class="w-10 h-8 border rounded cursor-pointer"
  />
  <span class="text-xs text-gray-500 font-mono">
    Hover háttér: {{ localContent.ctaHoverBgColor }}
  </span>
</div>

<div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
  <input
    type="color"
    v-model="localContent.ctaHoverTextColor"
    class="w-10 h-8 border rounded cursor-pointer"
  />
  <span class="text-xs text-gray-500 font-mono">
    Hover szöveg: {{ localContent.ctaHoverTextColor }}
  </span>
</div>


        <v-slider
          v-model="localContent.overlayOpacity"
          :min="0"
          :max="1"
          :step="0.05"
          label="Overlay átlátszóság"
        />

        <v-slider
          v-model="localContent.height"
          :min="40"
          :max="100"
          label="Magasság (vh)"
        />

        <v-select
          v-model="localContent.backgroundPosition"
          :items="['top', 'center', 'bottom']"
          label="Háttér pozíció"
        />
      </div>

      <v-btn class="admin-primary mt-6" @click="saveContent">
        Design mentése
      </v-btn>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'isomorphic-dompurify'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { FontSize } from '~/components/editor/extensions/FontSize'

const editor = ref(null)

onMounted(() => {
  editor.value = new Editor({
    content: localContent.value.html,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize
    ],
    onUpdate: ({ editor }) => {
      localContent.value.html = editor.getHTML()
    }
  })
})

onUnmounted(() => {
  if (editor.value) editor.value.destroy()
})


const { t, locale } = useI18n()
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

const showContentEditor = ref(false)
const showDesignEditor = ref(false)

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px', '64px', '72px']

const fontFamilies = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Tahoma',
  'Courier New'
]

const hovering = ref(false)

/* PROPS */
const props = defineProps({
  content: { type: Object, default: () => ({}) },
  sectionKey: { type: String, required: true }
})

/* ADMIN CHECK */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

/* LOCAL CONTENT WITH FALLBACKS */
const localContent = ref({
  html: '',
  image: '',
  overlayColor: 'rgba(0,0,0,0.4)',
  overlayOpacity: 0.4,
  backgroundPosition: 'center',
  height: 75,
  ctaText: '',
  ctaLink: '',
  ctaBgColor: '#ffffff',
  ctaTextColor: '#000000',
  ctaHoverBgColor: '#000000',
  ctaHoverTextColor: '#ffffff',
})

/* INITIAL LOAD + FALLBACK LOGIC */
watch(
  () => props.content,
  (val) => {
    if (!val) return

    // Fallback HTML generation
    const html =
      val.html ||
      `<h1>${val.title || ''}</h1><p>${val.subtitle || ''}</p>`

    localContent.value = {
      html,
      image: val.image || '',
      overlayColor: val.overlayColor || 'rgba(0,0,0,0.4)',
      overlayOpacity: val.overlayOpacity ?? 0.4,
      backgroundPosition: val.backgroundPosition || 'center',
      height: val.height || 75,
      ctaText: val.ctaText || '',
      ctaLink: val.ctaLink || '',
      ctaBgColor: val.ctaBgColor || '#ffffff',
      ctaTextColor: val.ctaTextColor || '#000000',
      ctaHoverBgColor: val.ctaHoverBgColor || '#000000',
      ctaHoverTextColor: val.ctaHoverTextColor || '#ffffff'
    }
  },
  { immediate: true }
)

/* SANITIZED HTML */
const sanitizedHtml = computed(() =>
  DOMPurify.sanitize(localContent.value.html)
)

/* BACKGROUND URL */
const backgroundUrl = computed(() => {
  const img = localContent.value.image
  if (!img) return '/placeholder.jpg'
  if (img.startsWith('http')) return img
  return `${backendBase}${img.startsWith('/') ? img : '/' + img}`
})

/* HERO HEIGHT */
const heroHeight = computed(() => `${localContent.value.height}vh`)

/* IMAGE UPLOAD */
async function onImageSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await $fetch(`${backendBase}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    localContent.value.image = `${response.path}?t=${Date.now()}`
  } catch (err) {
    console.error('Image upload failed:', err)
  }
}

/* SAVE CONTENT */
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

/* PARALLAX */
const parallax = ref(null)

onMounted(() => {
  const handler = () => {
    if (!parallax.value) return
    const rect = parallax.value.getBoundingClientRect()
    const offset = rect.top * -0.3
    parallax.value.style.transform = `translateY(${offset}px)`
  }

  window.addEventListener('scroll', handler)
  onUnmounted(() => window.removeEventListener('scroll', handler))
})

/* READY CHECK */
const contentReady = computed(() => !!localContent.value.html)
</script>
<style scoped>
.parallax-bg {
  transform: scale(1.1);
  transform-origin: center;
  background-size: cover;
  will-change: transform;
}
.prose-invert h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
}
.prose-invert p {
  color: rgba(255,255,255,0.9);
  font-size: 1.25rem;
}
</style>
