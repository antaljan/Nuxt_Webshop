<template>
<section
  :id="sectionKey"
  class="relative overflow-hidden pt-24"
  :class="localContent.wave ? 'pb-44' : 'pb-24'"
  :style="{ backgroundColor: localContent.backgroundColor }"
>

  <div
    class="relative z-10 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
  >

    <!-- IMAGE -->
    <div
      class="flex justify-center md:justify-start relative"
      :class="reverse ? 'md:order-2' : 'md:order-1'"
    >
      <img
        :src="imageUrl"
        alt="Section image"
        class="rounded-lg max-w-sm w-full h-auto"
      />

      <!-- IMAGE UPLOAD BUTTON (ADMIN) -->
      <div v-if="isAdmin && editDesignMode" class="absolute top-2 right-2">
        <v-btn class="admin-secondary" size="small" @click="triggerImageUpload">
          Kép feltöltése
        </v-btn>
        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onImageSelected"
        />
      </div>

    </div>

    <!-- TEXT -->
    <div
      class="md:pl-4"
      :class="reverse ? 'md:order-1' : 'md:order-2'"
    >
      <!-- PUBLIC TEXT -->
      <div
        v-if="!isAdmin || !editTextMode"
        class="prose max-w-none transition-all duration-300"
        :style="{ 
          color: brandTextAndFont.textColor, 
          fontFamily: brandTextAndFont.fontFamily 
        }"
        v-html="sanitizedHtml"
      />

      <!-- ADMIN BUTTONS -->
      <div v-if="isAdmin && !editTextMode && !editDesignMode" class="mt-6 flex flex-wrap gap-3">
        <v-btn class="admin-primary" @click="openTextEditor">
          Szöveg szerkesztése
        </v-btn>
        <v-btn class="admin-secondary" @click="openDesignEditor">
          Szakasz stílusa
        </v-btn>
      </div>

      <!-- TEXT EDITOR -->
      <div v-if="isAdmin && editTextMode" class="mt-4">

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
            <input type="color"
              class="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer"
              @input="e => editor?.chain().focus().setColor((e.target as HTMLInputElement).value).run()" />
          </div>

        </div>

        <!-- EDITOR CONTENT -->
        <div class="editor-wrapper border rounded-lg p-3 bg-white min-h-[300px]">
          <EditorContent v-if="editor" :editor="editor" />
        </div>

        <!-- TEXT EDITOR ACTIONS -->
        <div class="flex gap-3 mt-4 flex-wrap">
          <v-btn class="admin-success" @click="saveText">Mentés</v-btn>
          <v-btn class="admin-secondary" variant="outlined" @click="cancelText">Mégse</v-btn>
        </div>

      </div>

      <!-- DESIGN EDITOR -->
      <div v-if="isAdmin && editDesignMode" class="mt-6 p-5 rounded-xl border bg-white shadow-inner space-y-5">

        <h3 class="font-bold text-lg text-gray-800 border-b pb-2">
          Szakasz stílusbeállításai
        </h3>

        <!-- BACKGROUND COLOR -->
        <div>
          <p class="text-sm font-semibold text-gray-600 mb-2">Háttérszín:</p>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="color in brandPaletteColors"
              :key="color"
              class="w-10 h-10 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
              :style="{ backgroundColor: color, borderColor: localContent.backgroundColor === color ? '#000' : 'rgba(0,0,0,0.15)' }"
              @click="localContent.backgroundColor = color"
            >
              <v-icon v-if="localContent.backgroundColor === color" size="x-small" color="black">mdi-check</v-icon>
            </button>
          </div>
        </div>

        <!-- CUSTOM COLOR -->
        <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
          <span class="text-sm font-medium">Egyedi háttérszín:</span>
          <input type="color" v-model="localContent.backgroundColor" class="w-10 h-8 border rounded cursor-pointer" />
          <span class="text-xs text-gray-500 font-mono">{{ localContent.backgroundColor }}</span>
        </div>

        <hr class="border-gray-200 my-2" />

        <!-- WAVES -->
        <div>
          <p class="text-sm font-semibold text-gray-600 mb-2">Szakasz lezáró él:</p>
          <div class="flex flex-wrap gap-3">
            <button
              class="w-24 h-12 border rounded bg-gray-50 flex items-center justify-center cursor-pointer text-xs font-medium text-gray-500 transition-all"
              :class="{ 'ring-2 ring-primary bg-white text-black font-semibold': !localContent.wave }"
              @click="localContent.wave = null"
            >
              Egyenes él
            </button>

            <button
              v-for="wave in wavePalette"
              :key="wave"
              class="w-24 h-12 border rounded overflow-hidden flex items-end justify-center bg-gray-50 cursor-pointer transition-all p-1"
              :class="{ 'ring-2 ring-primary bg-white': localContent.wave === wave }"
              @click="localContent.wave = wave"
            >
              <img :src="`/waves/${wave}.svg`" alt="Wave icon" class="w-full h-full object-contain opacity-70" />
            </button>
          </div>
        </div>

        <!-- WAVE COLOR -->
        <div v-if="localContent.wave" class="space-y-3 pt-2">
          <p class="text-sm font-semibold text-gray-600">Hullám kitöltése:</p>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="color in brandPaletteColors"
              :key="'wave-' + color"
              class="w-10 h-10 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
              :style="{ backgroundColor: color, borderColor: localContent.waveColor === color ? '#000' : 'rgba(0,0,0,0.15)' }"
              @click="localContent.waveColor = color"
            >
              <v-icon v-if="localContent.waveColor === color" size="x-small" color="black">mdi-check</v-icon>
            </button>
          </div>

          <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
            <input type="color" v-model="localContent.waveColor" class="w-10 h-8 border rounded cursor-pointer" />
            <span class="text-xs text-gray-500 font-mono">{{ localContent.waveColor }}</span>
          </div>
        </div>

        <!-- DESIGN EDITOR ACTIONS -->
        <div class="flex gap-3 mt-4 flex-wrap">
          <v-btn class="admin-success" @click="saveDesign">Mentés</v-btn>
          <v-btn class="admin-secondary" variant="outlined" @click="cancelDesign">Mégse</v-btn>
        </div>

      </div>

    </div>
  </div>

  <!-- WAVE SVG -->
  <div
    v-if="localContent.wave"
    class="absolute bottom-0 left-0 w-full pointer-events-none z-10 leading-none"
    v-html="coloredWaveSvg"
  ></div>

</section>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useRuntimeConfig } from '#app'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { FontSize } from '~/components/editor/extensions/FontSize'
import { useBrand } from '@/composables/useBrand'

const { t, locale } = useI18n()
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

const config = useRuntimeConfig()
const backendBase = config.public.backendBase

const props = defineProps<{
  content: any,
  sectionKey: string
}>()

const reverse = computed(() => {
  return props.content?.reverse === true
})

/* -------------------------------------------------------------
   EDITOR MÓDOK KÜLÖN
------------------------------------------------------------- */
const editTextMode = ref(false)
const editDesignMode = ref(false)

/* -------------------------------------------------------------
   LOKÁLIS TARTALOM + EREDETI ÁLLAPOTOK
------------------------------------------------------------- */
const localContent = ref<any>({
  html: '',
  image: '',
  backgroundColor: '#ffffff',
  wave: null,
  waveColor: '#ffffff'
})

const originalTextContent = ref<{ html: string } | null>(null)
const originalDesignContent = ref<{ backgroundColor: string, wave: any, waveColor: string } | null>(null)

/* -------------------------------------------------------------
   HULLÁMOK
------------------------------------------------------------- */
const waveSvgs = {
  'organic-1': `<svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display: block; width: 100%; height: 100px;">
    <path d="M0,80 C240,160 480,0 720,80 C960,160 1200,40 1440,100 L1440,200 L0,200 Z" fill="currentColor"/>
  </svg>`,
  'organic-2': `<svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display: block; width: 100%; height: 100px;">
    <path d="M0,120 C300,20 600,200 900,100 C1150,20 1300,80 1440,40 L1440,200 L0,200 Z" fill="currentColor"/>
  </svg>`,
  'organic-3': `<svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display: block; width: 100%; height: 110px;">
    <path d="M0,140 C200,200 400,60 700,120 C1000,180 1200,40 1440,100 L1440,220 L0,220 Z" fill="currentColor" opacity="0.7"/>
    <path d="M0,160 C250,100 500,200 800,140 C1100,80 1300,160 1440,120 L1440,220 L0,220 Z" fill="currentColor"/>
  </svg>`,
  'organic-4': `<svg viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display: block; width: 100%; height: 90px;">
    <path d="M0,100 C300,180 600,20 900,80 C1150,130 1300,60 1440,90 L1440,180 L0,180 Z" fill="currentColor"/>
  </svg>`
}

const coloredWaveSvg = computed(() => {
  if (!localContent.value.wave) return ''
  const wave = waveSvgs[localContent.value.wave as keyof typeof waveSvgs]
  if (!wave) return ''
  return wave.replace(/currentColor/g, localContent.value.waveColor || '#ffffff')
})

const wavePalette = ref<string[]>([
  'organic-1',
  'organic-2',
  'organic-3',
  'organic-4'
])

/* -------------------------------------------------------------
   TARTALOM BETÖLTÉSE
------------------------------------------------------------- */
watch(
  () => props.content,
  (val) => {
    if (val) {
      localContent.value = {
        html: val.html || '',
        image: val.image || '',
        backgroundColor: val.backgroundColor || '#ffffff',
        wave: val.wave || null,
        waveColor: val.waveColor || '#ffffff'
      }
    }
  },
  { immediate: true }
)

/* -------------------------------------------------------------
   TIPTAP EDITOR
------------------------------------------------------------- */
const editor = ref<Editor | null>(null)
const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px']
const fontFamilies = [
  'Inter', 'Lato', 'Montserrat', 'Playfair Display', 'Merriweather',
  'Source Sans Pro', 'Source Serif Pro', 'Lora', 'Cormorant Garamond',
  'Libre Baskerville', 'Roboto', 'Georgia', 'Times New Roman', 'Arial', 'Verdana'
]

onMounted(() => {
  editor.value = new Editor({
    content: localContent.value.html || '',
    extensions: [StarterKit, TextStyle, Color, FontFamily, FontSize],
    onUpdate: ({ editor: e }) => {
      localContent.value.html = e.getHTML()
    }
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

/* -------------------------------------------------------------
   IMAGE URL
------------------------------------------------------------- */
const imageUrl = computed(() => {
  const img = localContent.value.image
  if (!img) return '/fallback.jpg'
  if (img.startsWith('http')) return img
  const normalized = img.startsWith('/') ? img : `/${img}`
  return `${backendBase}${normalized}`
})

/* -------------------------------------------------------------
   HTML SANITIZE
------------------------------------------------------------- */
const sanitizedHtml = computed(() => {
  if (process.server) return localContent.value.html || ''
  return DOMPurify.sanitize(localContent.value.html || '', {
    ALLOWED_ATTR: ['style', 'class', 'src', 'alt', 'href', 'target', 'rel']
  })
})

/* -------------------------------------------------------------
   TEXT EDITOR MÓD
------------------------------------------------------------- */
const openTextEditor = () => {
  originalTextContent.value = { html: localContent.value.html }
  editTextMode.value = true
}

const saveText = async () => {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
      method: 'PUT',
      body: {
        ...props.content,
        html: localContent.value.html
      }
    })
    editTextMode.value = false
    alert(t('common.saved') || 'Mentve')
  } catch (err) {
    console.error('Saving text failed:', err)
    alert('Hiba a szöveg mentésekor')
  }
}

const cancelText = () => {
  if (originalTextContent.value) {
    localContent.value.html = originalTextContent.value.html
    editor.value?.commands.setContent(localContent.value.html)
  }
  editTextMode.value = false
}

/* -------------------------------------------------------------
   DESIGN EDITOR MÓD
------------------------------------------------------------- */
const openDesignEditor = () => {
  originalDesignContent.value = {
    backgroundColor: localContent.value.backgroundColor,
    wave: localContent.value.wave,
    waveColor: localContent.value.waveColor
  }
  editDesignMode.value = true
}

const saveDesign = async () => {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
      method: 'PUT',
      body: {
        ...props.content,
        backgroundColor: localContent.value.backgroundColor,
        wave: localContent.value.wave,
        waveColor: localContent.value.waveColor,
        image: localContent.value.image
      }
    })
    editDesignMode.value = false
    alert(t('common.saved') || 'Mentve')
  } catch (err) {
    console.error('Saving design failed:', err)
    alert('Hiba a design mentésekor')
  }
}

const cancelDesign = () => {
  if (originalDesignContent.value) {
    localContent.value.backgroundColor = originalDesignContent.value.backgroundColor
    localContent.value.wave = originalDesignContent.value.wave
    localContent.value.waveColor = originalDesignContent.value.waveColor
  }
  editDesignMode.value = false
}

/* -------------------------------------------------------------
   KÉP FELTÖLTÉS – AZONNALI MENTÉS
------------------------------------------------------------- */
const imageInput = ref<HTMLInputElement | null>(null)

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const onImageSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const response: any = await $fetch(`${backendBase}/upload`, {
      method: 'POST',
      body: formData
    })

    if (response && response.path) {
      localContent.value.image = response.path

      await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
        method: 'PUT',
        body: {
          ...props.content,
          image: localContent.value.image,
          backgroundColor: localContent.value.backgroundColor,
          wave: localContent.value.wave,
          waveColor: localContent.value.waveColor,
          html: localContent.value.html
        }
      })

      alert(t('common.saved') || 'Kép mentve!')
    }
  } catch (err) {
    console.error('Image upload failed:', err)
    alert('Képfeltöltési hiba a backend felé!')
  } finally {
    if (input) input.value = ''
  }
}

/* -------------------------------------------------------------
   BRAND ARCULAT
------------------------------------------------------------- */
const { settings: brandSettings } = useBrand()

const brandPaletteColors = computed(() => {
  const bg = brandSettings.value?.backgroundColor || '#f7f5f8'
  const accent = brandSettings.value?.accentColor || '#1d3557'
  return [bg, accent, '#ffffff']
})

const brandTextAndFont = computed(() => {
  const currentSettings = brandSettings.value || {}
  return {
    textColor: currentSettings.textColor || '#2d3142',
    fontFamily: currentSettings.fontFamily || 'Inter'
  }
})
</script>

<style scoped>
.editor-wrapper :deep(.ProseMirror) {
  min-height: 250px;
  outline: none;
}
</style>
