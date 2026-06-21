<template>
  <section 
    :id="sectionKey"
    class="relative overflow-hidden pt-24"
    :class="localContent.wave ? 'pb-44' : 'pb-24'"
    :style="{ backgroundColor: localContent.backgroundColor }"
  >
    <div class="relative z-10 container mx-auto max-w-4xl px-4">

      <div>
        <!-- PUBLIKUS SZÖVEG MEGJELENÍTÉS: SSR-biztos opcionális láncolással -->
        <div
          v-if="!isAdmin || !editMode"
          class="prose max-w-none transition-all duration-300"
          :style="{ 
            color: brandTextAndFont?.textColor || '#2d3142', 
            fontFamily: brandTextAndFont?.fontFamily || 'Inter' 
          }"
          v-html="sanitizedHtml"
        />

        <!-- ADMIN TIPTAP SZERKESZTŐ -->
        <div v-if="isAdmin && editMode" class="mt-4">
          <div class="flex flex-wrap gap-2 mb-4 items-center bg-gray-50 p-2 rounded-lg border">

            <v-btn icon size="small" variant="text" @click="editor?.chain().focus().toggleBold().run()" :color="editor?.isActive('bold') ? 'primary' : ''">
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" @click="editor?.chain().focus().toggleItalic().run()" :color="editor?.isActive('italic') ? 'primary' : ''">
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" @click="editor?.chain().focus().undo().run()">
              <v-icon>mdi-undo</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" @click="editor?.chain().focus().redo().run()">
              <v-icon>mdi-redo</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" @click="editor?.chain().focus().setTextAlign('left').run()" :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : ''">
              <v-icon>mdi-format-align-left</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" @click="editor?.chain().focus().setTextAlign('center').run()" :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : ''">
              <v-icon>mdi-format-align-center</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" @click="editor?.chain().focus().setTextAlign('right').run()" :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : ''">
              <v-icon>mdi-format-align-right</v-icon>
            </v-btn>

            <v-select class="w-32" density="compact" hide-details :items="fontSizes" label="Méret" prepend-inner-icon="mdi-format-size" @update:modelValue="size => editor?.chain().focus().setFontSize(size).run()" />
            <v-select class="w-40" density="compact" hide-details :items="fontFamilies" label="Betűtípus" prepend-inner-icon="mdi-format-font" @update:modelValue="family => editor?.chain().focus().setFontFamily(family).run()" />

            <div class="relative flex items-center">
              <v-btn icon size="small" variant="text">
                <v-icon>mdi-format-color-text</v-icon>
              </v-btn>
              <input type="color" class="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer" @input="e => editor?.chain().focus().setColor((e.target as HTMLInputElement).value).run()" />
            </div>
          </div>

          <div 
            class="editor-wrapper border rounded-lg p-3 bg-white min-h-[300px]"
            :style="{ 
              color: brandTextAndFont?.textColor || '#2d3142', 
              fontFamily: brandTextAndFont?.fontFamily || 'Inter' 
            }"
          >
            <EditorContent v-if="editor" :editor="editor" />
          </div>

          <div class="flex gap-3 mt-4 flex-wrap">
            <v-btn color="success" @click="saveContent">{{ t('common.save') || 'Mentés' }}</v-btn>
            <v-btn color="grey" variant="outlined" @click="cancelEdit">{{ t('common.cancel') || 'Mégse' }}</v-btn>
          </div>
        </div>

        <!-- ADMIN ALAPVÉZÉRLŐK -->
        <div v-if="isAdmin && !editMode" class="mt-6 flex flex-wrap gap-3">
          <v-btn color="primary" @click="editMode = true">
            {{ t('common.edit') || 'Szerkesztés' }}
          </v-btn>
          <v-btn color="secondary" @click="showStyleEditor = !showStyleEditor">
            {{ showStyleEditor ? (t('common.closeEditor') || 'Bezárás') : (t('common.sectionStyle') || 'Szakasz stílusa') }}
          </v-btn>
        </div>

        <!-- ARCULATI SZEKCIÓ STÍLUS SZERKESZTŐ -->
        <div v-if="isAdmin && showStyleEditor" class="mt-6 p-5 rounded-xl border bg-white shadow-inner space-y-5 text-black">
          <h3 class="font-bold text-lg text-gray-800 border-b pb-2">
            {{ t('admin.brand.sectionStyle') || 'Szakasz stílusbeállításai' }}
          </h3>

          <!-- KORLÁTOZOTT MÁRKASPECIFIKUS HÁTTÉRSZÍN -->
          <div>
            <p class="text-sm font-semibold text-gray-600 mb-2">
              {{ t('admin.brand.sectionBackground') || 'Szakasz háttérszíne:' }}
            </p>
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

          <!-- EGYEDI SZÍN VÁLASZTÓ -->
          <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
            <span class="text-sm font-medium">
              {{ t('admin.brand.customBackground') || 'Egyedi háttérszín:' }}
            </span>
            <input type="color" v-model="localContent.backgroundColor" class="w-10 h-8 border rounded cursor-pointer" />
            <span class="text-xs text-gray-500 font-mono">{{ localContent.backgroundColor }}</span>
          </div>

          <hr class="border-gray-200 my-2" />

          <!-- HULLÁM FORMÁK VIZUÁLIS IKONOKKAL -->
          <div>
            <p class="text-sm font-semibold text-gray-600 mb-2">
              {{ t('admin.brand.sectionWave') || 'Szakasz lezáró él (Forma):' }}
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
                class="w-24 h-12 border rounded overflow-hidden flex items-end justify-center bg-gray-50 cursor-pointer transition-all p-1"
                :class="{ 'ring-2 ring-primary bg-white': localContent.wave === wave }"
                @click="localContent.wave = wave"
              >
                <img :src="`/waves/${wave}.svg`" alt="Wave icon" class="w-full h-full object-contain opacity-70" />
              </button>
            </div>
          </div>

          <!-- HULLÁM KITÖLTÉSI SZÍNE -->
          <div v-if="localContent.wave" class="space-y-3 pt-2">
            <p class="text-sm font-semibold text-gray-600">
              Következő szakasz színe (Hullám kitöltése):
            </p>
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

        </div>
      </div>
    </div>

    <!-- DINAMIKUS SVG HULLÁM -->
    <div
      v-if="localContent.wave"
      class="absolute bottom-0 left-0 w-full pointer-events-none z-10 leading-none"
      v-html="coloredWaveSvg"
    ></div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useContent } from '~/composables/useContent'
import { useBrand } from '@/composables/useBrand'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { FontSize } from '~/components/editor/extensions/FontSize'

const { t, locale } = useI18n()
const { settings: brandSettings } = useBrand()

const props = defineProps<{
  sectionKey: string,
  content?: any
}>()

const { user } = useAuth()
const { getSection, updateSection } = useContent()

const isAdmin = computed(() => user.value?.role === 'admin')
const editMode = ref(false)
const showStyleEditor = ref(false)

// Lokális reaktív tartalom objektum
const localContent = ref<any>({
  html: '',
  backgroundColor: '#ffffff',
  wave: null,
  waveColor: '#ffffff'
})

const editor = ref<Editor | null>(null)

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px']
const fontFamilies = [
  'Inter', 'Lato', 'Montserrat', 'Playfair Display', 'Merriweather',
  'Source Sans Pro', 'Source Serif Pro', 'Lora', 'Cormorant Garamond',
  'Libre Baskerville', 'Roboto', 'Georgia', 'Times New Roman', 'Arial', 'Verdana'
]

const wavePalette = ref<string[]>([
  'organic-1',
  'organic-2',
  'organic-3',
  'organic-4'
])

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

// Eredeti Content loading asszinkron logika - Érintetlenül megőrizve!
const { data: fetchedContent } = await useAsyncData(
  `content-${props.sectionKey}-${locale.value}`,
  () => props.content ? Promise.resolve(props.content) : getSection(props.sectionKey, locale.value),
  { watch: [locale] }
)

const activeContent = computed(() => props.content || fetchedContent.value)

watch(activeContent, (newVal) => {
  if (newVal) {
    localContent.value = {
      html: newVal.html || '',
      backgroundColor: newVal.backgroundColor || '#ffffff',
      wave: newVal.wave || null,
      waveColor: newVal.waveColor || '#ffffff'
    }
    if (editor.value) {
      editor.value.commands.setContent(localContent.value.html)
    }
  }
}, { immediate: true })

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

const saveContent = async () => {
  try {
    await updateSection(props.sectionKey, locale.value, localContent.value)
    editMode.value = false
    showStyleEditor.value = false
  } catch (err) {
    console.error('Error saving section content:', err)
  }
}

const cancelEdit = () => {
  if (activeContent.value) {
    localContent.value = {
      html: activeContent.value.html || '',
      backgroundColor: activeContent.value.backgroundColor || '#ffffff',
      wave: activeContent.value.wave || null,
      waveColor: activeContent.value.waveColor || '#ffffff'
    }
    editor.value?.commands.setContent(localContent.value.html)
  }
  editMode.value = false
  showStyleEditor.value = false
}

/* -------------------------------------------------------------
   INTELLIGENS ARCULATI SZÍNPALETTA GENERÁLÁS (SZIKLABIZTOS HEX)
------------------------------------------------------------- */
const brandPaletteColors = computed(() => {
  const bg = brandSettings.value?.backgroundColor || '#f7f5f8'
  const accent = brandSettings.value?.accentColor || '#1d3557'
  return [bg, accent, '#ffffff']
})

/* -------------------------------------------------------------
   SSR-BIZTOS SZÖVEGSZÍN ÉS BETŰTÍPUS FALLBACK LOGIKA
------------------------------------------------------------- */
const brandTextAndFont = computed(() => {
  const currentSettings = brandSettings?.value || {}
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