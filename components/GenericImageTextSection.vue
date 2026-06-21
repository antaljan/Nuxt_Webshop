<template>
<section
  :id="sectionKey"
  class="relative overflow-hidden pt-24"
  :class="localContent.wave ? 'pb-44' : 'pb-24'"
  :style="{ backgroundColor: localContent.backgroundColor }"
>

  <div class="relative z-10 container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

    <div class="flex justify-center md:justify-start">
      <img
        :src="imageUrl"
        alt="Section image"
        class="rounded-lg shadow max-w-sm w-full h-auto"
      />
    </div>

    <div class="md:pl-4">

<div
  v-if="!isAdmin || !editMode"
  class="prose max-w-none transition-all duration-300"
  :style="{ 
    color: brandTextAndFont.textColor, 
    fontFamily: brandTextAndFont.fontFamily 
  }"
  v-html="sanitizedHtml"
/>

      <div v-if="isAdmin && !editMode" class="mt-6 flex flex-wrap gap-3">
        <v-btn color="primary" @click="editMode = true">
          {{ t('common.edit') }}
        </v-btn>
        <v-btn color="secondary" @click="showStyleEditor = !showStyleEditor">
          {{ showStyleEditor ? t('common.closeEditor') : t('common.sectionStyle') || 'Section style' }}
        </v-btn>
      </div>

      <div v-if="isAdmin && editMode" class="mt-4">

        <div class="flex flex-wrap gap-2 mb-4 items-center">

          <v-btn
            icon
            size="small"
            variant="text"
            @click="editor?.chain().focus().toggleBold().run()"
            :color="editor?.isActive('bold') ? 'primary' : ''"
          >
            <v-icon>mdi-format-bold</v-icon>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            @click="editor?.chain().focus().toggleItalic().run()"
            :color="editor?.isActive('italic') ? 'primary' : ''"
          >
            <v-icon>mdi-format-italic</v-icon>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            @click="editor?.chain().focus().undo().run()"
          >
            <v-icon>mdi-undo</v-icon>
          </v-btn>

          <v-btn
            icon
            size="small"
            variant="text"
            @click="editor?.chain().focus().redo().run()"
          >
            <v-icon>mdi-redo</v-icon>
          </v-btn>

          <v-select
            class="w-32"
            density="compact"
            :items="fontSizes"
            label="Méret"
            prepend-inner-icon="mdi-format-size"
            @update:modelValue="size => editor?.chain().focus().setFontSize(size).run()"
          />

          <v-select
            class="w-40"
            density="compact"
            :items="fontFamilies"
            label="Betűtípus"
            prepend-inner-icon="mdi-format-font"
            @update:modelValue="family => editor?.chain().focus().setFontFamily(family).run()"
          />

          <div class="relative flex items-center">
            <v-btn icon size="small" variant="text">
              <v-icon>mdi-format-color-text</v-icon>
            </v-btn>
            <input
              type="color"
              class="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer"
              @input="e => editor?.chain().focus().setColor((e.target as HTMLInputElement).value).run()"
            />
          </div>

        </div>

        <div class="editor-wrapper border rounded-lg p-2 bg-white min-h-[300px]">
          <EditorContent v-if="editor" :editor="editor" />
        </div>

        <div class="flex gap-4 mt-4 flex-wrap">
          <v-btn color="primary" @click="saveContent">
            {{ t('common.save') }}
          </v-btn>
          <v-btn color="secondary" @click="cancelEdit">
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn color="secondary" @click="editMode = false">
            {{ t('common.closeEditor') }}
          </v-btn>
        </div>

      </div>

      <div v-if="isAdmin && showStyleEditor" class="mt-6 p-4 rounded-lg border bg-white/70 space-y-4">

        <h3 class="font-semibold text-lg mb-2">
          {{ t('admin.brand.sectionStyle') || 'Section style' }}
        </h3>

<div>
  <p class="text-sm font-medium mb-2">
    {{ t('admin.brand.sectionBackground') || 'Section background color' }}
  </p>
  <div class="flex flex-wrap gap-2">
    <!-- A fix paletta helyett az intelligens, dinamikus arculati körök jelennek meg -->
    <button
      v-for="color in brandPaletteColors"
      :key="color"
      class="w-8 h-8 rounded-full border cursor-pointer transition-transform hover:scale-110 flex items-center justify-center"
      :style="{ backgroundColor: color, borderColor: localContent.backgroundColor === color ? '#000' : 'rgba(0,0,0,0.15)' }"
      @click="localContent.backgroundColor = color"
    >
      <!-- Kis check ikon, ha ez a szín van kiválasztva -->
      <v-icon v-if="localContent.backgroundColor === color" size="x-small" color="black">mdi-check</v-icon>
    </button>
  </div>
</div>

        <div class="flex items-center gap-3">
          <span class="text-sm font-medium">
            {{ t('admin.brand.customBackground') || 'Custom background' }}
          </span>
          <input
            type="color"
            v-model="localContent.backgroundColor"
            class="w-10 h-8 border rounded cursor-pointer"
          />
          <span class="text-xs text-gray-600">
            {{ localContent.backgroundColor }}
          </span>
        </div>

        <hr class="border-gray-200 my-2" />

        <div>
          <p class="text-sm font-medium mb-2">
            {{ t('admin.brand.sectionWave') || 'Section shape' }}
          </p>
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
              class="w-24 h-12 border rounded overflow-hidden flex items-end justify-center bg-gray-50 cursor-pointer transition-all"
              :class="{ 'ring-2 ring-primary': localContent.wave === wave }"
              @click="localContent.wave = wave"
            >
              <img
                :src="`/waves/${wave}.svg`"
                alt=""
                class="w-full h-full object-cover"
                />
            </button>
          </div>
        </div>

        <div v-if="localContent.wave" class="space-y-3 pt-2">
          <p class="text-sm font-medium">
            Következő szakasz színe (Hullám színe)
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in brandPaletteColors"
              :key="'wave-' + color"
              class="w-8 h-8 rounded-full border cursor-pointer"
              :style="{ backgroundColor: color, borderColor: localContent.waveColor === color ? '#000' : 'transparent' }"
              @click="localContent.waveColor = color"
            />
          </div>
          <div class="flex items-center gap-3">
            <input
              type="color"
              v-model="localContent.waveColor"
              class="w-10 h-8 border rounded cursor-pointer"
            />
            <span class="text-xs text-gray-600">
              {{ localContent.waveColor }}
            </span>
          </div>
        </div>

      </div>

    </div>
  </div>

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

const { t, locale } = useI18n()

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
  // A hullám dinamikusan felveszi az admin által beállított waveColor-t
  return wave.replace(/currentColor/g, localContent.value.waveColor || '#ffffff') 
})

const props = defineProps<{
  content: any,
  sectionKey: string,
  reverse?: boolean
}>()

const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

const config = useRuntimeConfig()
const backendBase = config.public.backendBase

const editMode = ref(false)
const showStyleEditor = ref(false)

const localContent = ref<any>({
  html: '',
  image: '',
  backgroundColor: '#ffffff',
  wave: 'organic-1',
  waveColor: '#ffffff'
})

watch(
  () => props.content,
  (val) => {
    if (val) {
      localContent.value = {
        html: val.html || '',
        image: val.image || '',
        backgroundColor: val.backgroundColor || '#ffffff',
        wave: val.wave || null, // null, ha nincs wave, vagy az adatbázis szerinti érték
        waveColor: val.waveColor || '#ffffff'
      }
    }
  },
  { immediate: true }
)

const editor = ref<Editor | null>(null)
const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px']
const fontFamilies = [
  'Inter', 'Lato', 'Montserrat', 'Playfair Display', 'Merriweather',
  'Source Sans Pro', 'Source Serif Pro', 'Lora', 'Cormorant Garamond',
  'Libre Baskerville', 'Roboto', 'Georgia', 'Times New Roman', 'Arial', 'Verdana'
]

const backgroundPalette = ref<string[]>([
  '#ffffff',
  '#29459E',
  '#E8C7D0',
  '#C8A46B',
  '#A8C3A0',
  '#F7F3ED',
  '#FAF8F5'
])

const wavePalette = ref<string[]>([
  'organic-1',
  'organic-2',
  'organic-3',
  'organic-4'
])

const imageUrl = computed(() => {
  const img = localContent.value.image
  if (!img) return '/fallback.jpg'
  if (img.startsWith('http')) return img
  const normalized = img.startsWith('/') ? img : `/${img}`
  return `${backendBase}${normalized}`
})

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

const sanitizedHtml = computed(() => {
  if (process.server) return localContent.value.html || ''
  return DOMPurify.sanitize(localContent.value.html || '', {
    ALLOWED_ATTR: ['style', 'class', 'src', 'alt', 'href', 'target', 'rel']
  })
})

const insertImageByUrl = () => {
  const url = window.prompt('Add meg a kép URL-jét:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
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
      await saveContent()
    }
  } catch (err) {
    console.error('Image upload failed:', err)
    alert('Képfeltöltési hiba a backend felé!')
  }
}

const saveContent = async () => {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
      method: 'PUT',
      body: localContent.value
    })
    alert(t('common.saved') || 'Content saved!')
    editMode.value = false
  } catch (err) {
    console.error('Saving content failed:', err)
    alert('Error saving content')
  }
}

const cancelEdit = () => {
  if (props.content) {
    localContent.value.html = props.content.html || ''
    localContent.value.backgroundColor = props.content.backgroundColor || '#ffffff'
    localContent.value.wave = props.content.wave !== undefined ? props.content.wave : 'organic-1'
    localContent.value.waveColor = props.content.waveColor || '#ffffff'
    editor.value?.commands.setContent(localContent.value.html)
  }
  editMode.value = false
}
/* -------------------------------------------------------------
   INTELLIGENS ARCULATI SZÍNPALETTA GENERÁLÁS (A Te kódod mellé)
------------------------------------------------------------- */
import { useBrand } from '@/composables/useBrand'
const { settings: brandSettings } = useBrand()

const brandPaletteColors = computed(() => {
  // Lekérjük a globális brandSettings-ből az éppen aktuális értékeket
  const bg = brandSettings.value?.backgroundColor || '#f7f5f8'
  const accent = brandSettings.value?.accentColor || '#1d3557'
  
  // Visszaadjuk a korlátozott listát: Alap háttér, Akszentus, és a tiszta fehér a kontraszthoz
  return [bg, accent, '#ffffff']
})

/* -------------------------------------------------------------
   DINAMIKUS ALAPÉRTELMEZETT SZÖVEGSZÍN ÉS BETŰTÍPUS SZINKRON
------------------------------------------------------------- */
const brandTextAndFont = computed(() => {
  // Biztonságos ellenőrzés: ha a brandSettings még nem töltődött be (SSR alatt), 
  // akkor az arculatod gyári alapértelmezett értékeivel térünk vissza, így nincs többé undefined hiba.
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