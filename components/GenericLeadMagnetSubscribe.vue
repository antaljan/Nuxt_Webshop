<script setup lang="ts">

import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'

import DOMPurify from 'dompurify'

import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useBrand } from '@/composables/useBrand'

import {
  Editor,
  EditorContent
} from '@tiptap/vue-3'

import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'

import { FontSize }
  from '~/components/editor/extensions/FontSize'

const { locale } = useI18n()

const { user } = useAuth()

const {
  settings: brandSettings
} = useBrand()

const isAdmin = computed(
  () => user.value?.role === 'admin'
)

const props = defineProps<{
  content: any
  sectionKey: string
}>()

/* -------------------------------------------------------------
   EDIT MODES
------------------------------------------------------------- */

const editContentMode = ref(false)

const editCampaignMode = ref(false)

const editDesignMode = ref(false)

/* -------------------------------------------------------------
   FORM
------------------------------------------------------------- */

const firstname = ref('')

const name = ref('')

const email = ref('')

const gdpr = ref(false)

const valid = ref(false)

const loading = ref(false)

const form = ref()

/* -------------------------------------------------------------
   LOCAL CONTENT
------------------------------------------------------------- */

const localContent = ref({

  html: '',

  consentHtml: '',

  ctaText: '',

  campaignSlug: '',

  successSlug: '',

  backgroundColor: '#f7f5f8',

  wave: null,

  waveColor: '#ffffff'

})

/* -------------------------------------------------------------
   TIPTAP EDITORS
------------------------------------------------------------- */

const htmlEditor =
  ref<Editor | null>(null)

const consentEditor =
  ref<Editor | null>(null)

watch(
  () => props.content,
  value => {

    if (!value) {
      return
    }

    localContent.value = {

      html:
        value.html || '',

      consentHtml:
        value.consentHtml || '',

      ctaText:
        value.ctaText || '',

      campaignSlug:
        value.campaignSlug || '',

      successSlug:
        value.successSlug || '',

      backgroundColor:
        value.backgroundColor ||
        '#f7f5f8',

      wave:
        value.wave || null,

      waveColor:
        value.waveColor ||
        '#ffffff'

    }

    if (htmlEditor.value) {
      htmlEditor.value.commands.setContent(
        localContent.value.html
      )
    }

    if (consentEditor.value) {
      consentEditor.value.commands.setContent(
        localContent.value.consentHtml
      )
    }

  },
  {
    immediate: true
  }
)


const fontSizes = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '32px'
]

const fontFamilies = [

  'Inter',
  'Lato',
  'Montserrat',
  'Playfair Display',
  'Merriweather',

  'Source Sans Pro',
  'Source Serif Pro',
  'Lora',

  'Cormorant Garamond',

  'Libre Baskerville',

  'Roboto',
  'Georgia',
  'Times New Roman',
  'Arial',
  'Verdana'

]

onMounted(() => {

  htmlEditor.value =
    new Editor({

      content:
        localContent.value.html,

      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        FontFamily,
        FontSize,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank'
          }
        })
      ],

      onUpdate:
        ({ editor }) => {

          localContent.value.html =
            editor.getHTML()

        }

    })

  consentEditor.value =
    new Editor({

      content:
        localContent.value.consentHtml,

      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        FontFamily,
        FontSize,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank'
          }
        })
      ],

      onUpdate:
        ({ editor }) => {

          localContent.value.consentHtml =
            editor.getHTML()

        }

    })

})

onBeforeUnmount(() => {

  htmlEditor.value?.destroy()

  consentEditor.value?.destroy()

})

/* -------------------------------------------------------------
   BRAND
------------------------------------------------------------- */

const brandTextAndFont =
  computed(() => {

    const current =
      brandSettings.value || {}

    return {

      textColor:
        current.textColor ||
        '#2d3142',

      fontFamily:
        current.fontFamily ||
        'Inter',

      titleFontFamily:
        current.titleFontFamily ||
        'Playfair Display',

      primaryColor:
        current.primaryColor ||
        '#b87d8e',

      accentColor:
        current.accentColor ||
        '#1d3557'

    }

})

/* -------------------------------------------------------------
   WAVE SHAPES
------------------------------------------------------------- */

const waveSvgs = {

  'organic-1': `<svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:100px;">
    <path d="M0,80 C240,160 480,0 720,80 C960,160 1200,40 1440,100 L1440,200 L0,200 Z" fill="currentColor"/>
  </svg>`,

  'organic-2': `<svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:100px;">
    <path d="M0,120 C300,20 600,200 900,100 C1150,20 1300,80 1440,40 L1440,200 L0,200 Z" fill="currentColor"/>
  </svg>`,

  'organic-3': `<svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:110px;">
    <path d="M0,140 C200,200 400,60 700,120 C1000,180 1200,40 1440,100 L1440,220 L0,220 Z" fill="currentColor" opacity="0.7"/>
    <path d="M0,160 C250,100 500,200 800,140 C1100,80 1300,160 1440,120 L1440,220 L0,220 Z" fill="currentColor"/>
  </svg>`,

  'organic-4': `<svg viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block;width:100%;height:90px;">
    <path d="M0,100 C300,180 600,20 900,80 C1150,130 1300,60 1440,90 L1440,180 L0,180 Z" fill="currentColor"/>
  </svg>`

}

const wavePalette = ref([
  'organic-1',
  'organic-2',
  'organic-3',
  'organic-4'
])

const coloredWaveSvg = computed(() => {

  if (!localContent.value.wave) {
    return ''
  }

  const wave = waveSvgs[ localContent.value.wave as keyof typeof waveSvgs ]

  if (!wave) {
    return ''
  }

  return wave.replace( /currentColor/g,localContent.value.waveColor || '#ffffff')

})

const brandPaletteColors =
  computed(() => {

    const bg = brandSettings.value ?.backgroundColor || '#f7f5f8'

    const accent = brandSettings.value ?.accentColor || '#1d3557'

    return [
      bg,
      accent,
      '#ffffff'
    ]
})

/* -------------------------------------------------------------
   PUBLIC HTML
------------------------------------------------------------- */

const sanitizedHtml =
  computed(() => {

    if (process.server) {

      return localContent.value.html

    }

    return DOMPurify.sanitize(

      localContent.value.html,

      {

        ALLOWED_ATTR: [
          'style',
          'class',
          'href',
          'target',
          'rel'
        ]

      }

    )

})

const sanitizedConsentHtml =
  computed(() => {

    if (process.server) {

      return localContent.value
        .consentHtml

    }

    return DOMPurify.sanitize(

      localContent.value
        .consentHtml,

      {

        ALLOWED_ATTR: [
          'style',
          'class',
          'href',
          'target',
          'rel'
        ]

      }

    )

})

/* -------------------------------------------------------------
   SAVE HELPERS
------------------------------------------------------------- */

async function saveContent() {

  await $fetch(
    `/api/content/${props.sectionKey}/${locale.value}`,
    {
      method: 'PUT',

      body: {

        ...props.content,

        html:
          localContent.value.html,

        consentHtml:
          localContent.value
            .consentHtml,

        ctaText:
          localContent.value.ctaText

      }

    }
  )

  editContentMode.value =
    false

}

async function saveCampaign() {

  await $fetch(
    `/api/content/${props.sectionKey}/${locale.value}`,
    {
      method: 'PUT',

      body: {

        ...props.content,

        campaignSlug:
          localContent.value
            .campaignSlug,

        successSlug:
          localContent.value
            .successSlug

      }

    }
  )

  editCampaignMode.value =
    false

}

/* -------------------------------------------------------------
   SUBMIT
------------------------------------------------------------- */

async function handleSubscribe() {

  const {
    valid: isFormValid
  } =
    await form.value.validate()

  if (!isFormValid) {
    return
  }

  const campaignSlug =
    localContent.value
      .campaignSlug

  if (!campaignSlug) {

    alert(
      'Kampány nincs konfigurálva.'
    )

    return

  }

  await $fetch(
    '/api/newsletter/subscribe',
    {
      method: 'POST',

      body: {

        firstname:
          firstname.value,

        name:
          name.value,

        email:
          email.value,

        language:
          locale.value,

        campaignSlug

      }

    }
  )

  if (
    localContent.value
      .successSlug
  ) {

    navigateTo(
      `/${localContent.value
        .successSlug}`
    )

  }

}

async function saveDesign() {

  try {

    await $fetch(
      `/api/content/${props.sectionKey}/${locale.value}`,
      {
        method: 'PUT',

        body: {

          ...props.content,

          backgroundColor:
            localContent.value
              .backgroundColor,

          wave:
            localContent.value
              .wave,

          waveColor:
            localContent.value
              .waveColor

        }

      }
    )

    editDesignMode.value =
      false

  } catch (err) {

    console.error(
      'Saving design failed:',
      err
    )

    alert(
      'Hiba a design mentésekor'
    )

  }

}

function setLink(
  editor: Editor | null
) {

  if (!editor) return

  const previousUrl =
    editor.getAttributes('link').href

  const url = window.prompt(
    'Link URL',
    previousUrl || ''
  )

  if (url === null) {
    return
  }

  if (url === '') {

    editor
      .chain()
      .focus()
      .unsetLink()
      .run()

    return

  }

const normalizedUrl =
  url.startsWith('/')
    ? url
    : url.startsWith('http')
      ? url
      : `/${url}`

editor
  .chain()
  .focus()
  .setLink({
    href: normalizedUrl
  })
  .run()

}

</script>
<template>

  <section
    :id="sectionKey"
    class="relative overflow-hidden pt-12 pb-24"
    :style="{
      backgroundColor:
        localContent.backgroundColor
    }"
  >

    <div class="container mx-auto max-w-3xl">

      <v-card
        class="pa-8 rounded-xl shadow-lg"
      >

        <!-- PUBLIC VIEW -->

        <div
          v-if="
            !isAdmin ||
            (
              !editContentMode &&
              !editCampaignMode &&
              !editDesignMode
            )
          "
        >

          <div
            class="prose max-w-none mb-6"
            :style="{
              color:
                brandTextAndFont.textColor,

              fontFamily:
                brandTextAndFont.fontFamily
            }"
            v-html="sanitizedHtml"
          />

          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="handleSubscribe"
          >

            <v-text-field
              v-model="firstname"
              :label="
                $t('newsletter.firstname')
              "
              variant="outlined"
              class="mb-3"
            />

            <v-text-field
              v-model="email"
              :label="
                $t('newsletter.email')
              "
              :rules="[
                v =>
                  /.+@.+\..+/.test(v)
                  || ''
              ]"
              variant="outlined"
              class="mb-3"
            />

            <v-checkbox
              v-model="gdpr"
              :rules="[
                v => !!v || ''
              ]"
            >

              <template #label>

                <div
                  class="text-sm"
                  v-html="
                    sanitizedConsentHtml
                  "
                ></div>

              </template>

            </v-checkbox>

            <v-btn
              type="submit"
              block
              size="x-large"
              :loading="loading"
              :disabled="!valid"
              class="mt-4"
              :style="{
                backgroundColor:
                  brandTextAndFont.primaryColor,

                color: '#fff'
              }"
            >

              {{
                localContent.ctaText
              }}

            </v-btn>

          </v-form>

        </div>

        <!-- ADMIN BUTTONS -->

        <div
          v-if="
            isAdmin &&
            !editContentMode &&
            !editCampaignMode &&
            !editDesignMode
          "
          class="mt-6 flex flex-wrap gap-3"
        >

          <v-btn
            class="admin-primary"
            @click="
              editContentMode = true
            "
          >
            Tartalom szerkesztése
          </v-btn>

          <v-btn
            class="admin-secondary"
            @click="
              editCampaignMode = true
            "
          >
            Kampány beállítások
          </v-btn>

          <v-btn
            class="admin-secondary"
            @click="
              editDesignMode = true
            "
          >
            Design
          </v-btn>

        </div>

        <!-- CONTENT EDITOR -->

        <div
          v-if="
            isAdmin &&
            editContentMode
          "
          class="space-y-4"
        >

          <h3 class="text-lg font-bold">
            Tartalom szerkesztése
          </h3>

          <div
            class="editor-wrapper border rounded-lg p-3 bg-white min-h-[250px]"
          >
          <div
            class="flex flex-wrap gap-2 mb-4 items-center bg-gray-50 p-2 rounded-lg border"
          >

  <v-btn
    icon
    size="small"
    variant="text"
    @click="htmlEditor?.chain().focus().toggleBold().run()"
    :color="
      htmlEditor?.isActive('bold')
        ? 'primary'
        : ''
    "
  >
    <v-icon>
      mdi-format-bold
    </v-icon>
  </v-btn>

  <v-btn
    icon
    size="small"
    variant="text"
    @click="htmlEditor?.chain().focus().toggleItalic().run()"
    :color="
      htmlEditor?.isActive('italic')
        ? 'primary'
        : ''
    "
  >
    <v-icon>
      mdi-format-italic
    </v-icon>
  </v-btn>

  <v-btn
    icon
    size="small"
    variant="text"
    @click="
      htmlEditor?.chain().focus().undo().run()
    "
  >
    <v-icon>
      mdi-undo
    </v-icon>
  </v-btn>

  <v-btn
    icon
    size="small"
    variant="text"
    @click="
      htmlEditor?.chain().focus().redo().run()
    "
  >
    <v-icon>
      mdi-redo
    </v-icon>
  </v-btn>

<v-select
  class="w-32"
  density="compact"
  hide-details

  :items="fontSizes"

  label="Méret"

  @update:modelValue="
    size =>
      htmlEditor
        ?.chain()
        .focus()
        .setFontSize(size)
        .run()
  "
/>
<v-select
  class="w-40"
  density="compact"
  hide-details

  :items="fontFamilies"

  label="Betűtípus"

  @update:modelValue="
    family =>
      htmlEditor
        ?.chain()
        .focus()
        .setFontFamily(family)
        .run()
  "
/>
<div
  class="relative flex items-center"
>

  <v-btn
    icon
    size="small"
    variant="text"
  >
    <v-icon>
      mdi-format-color-text
    </v-icon>
  </v-btn>

  <input
    type="color"

    class="
      absolute
      left-0
      top-0
      w-8
      h-8
      opacity-0
      cursor-pointer
    "

    @input="
      e =>
        htmlEditor
          ?.chain()
          .focus()
          .setColor(
            (
              e.target as HTMLInputElement
            ).value
          )
          .run()
    "
  />

</div>
<v-btn
  icon
  size="small"
  variant="text"
  @click="setLink(htmlEditor)"
>

  <v-icon>
    mdi-link
  </v-icon>

</v-btn>
</div>
            <EditorContent
              v-if="htmlEditor"
              :editor="htmlEditor"
            />
          </div>
          <!-- CONSENT EDITOR --> 
          <h4 class="font-medium">
            Checkbox szöveg
          </h4>

          <div
            class="editor-wrapper border rounded-lg p-3 bg-white min-h-[200px]"
          >
          <div
            class="flex flex-wrap gap-2 mb-4 items-center bg-gray-50 p-2 rounded-lg border"
          >
            <v-btn
              icon
             size="small"
             variant="text"
              @click="
                consentEditor
                ?.chain()
                .focus()
                .toggleBold()
                .run()
              "
              :color="
                consentEditor?.isActive('bold')
                  ? 'primary'
                  : ''
               "
              >
                <v-icon>
                  mdi-format-bold
                </v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              @click="
                consentEditor
                  ?.chain()
                  .focus()
                  .toggleItalic()
                  .run()
              "
              :color="
                consentEditor?.isActive('italic')
                  ? 'primary'
                  : ''
              "
            >
              <v-icon>
                mdi-format-italic
              </v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              @click="
                consentEditor
                  ?.chain()
                  .focus()
                  .toggleUnderline()
                  .run()
              "
            >
              <v-icon>
                mdi-format-underline
              </v-icon>
            </v-btn>

            <v-btn
              icon
              size="small"
              variant="text"
              @click="setLink(consentEditor)"
            >
              <v-icon>
               mdi-link
              </v-icon>
            </v-btn>
          </div>
            <EditorContent
              v-if="consentEditor"
              :editor="
                consentEditor
              "
            />
          </div>

          <v-text-field
            v-model="
              localContent.ctaText
            "
            label="CTA szöveg"
            variant="outlined"
          />

          <div class="flex gap-3">

            <v-btn
              color="success"
              @click="saveContent"
            >
              Mentés
            </v-btn>

            <v-btn
              variant="outlined"
              @click="
                editContentMode = false
              "
            >
              Mégse
            </v-btn>

          </div>

        </div>

        <!-- CAMPAIGN EDITOR -->

        <div
          v-if="
            isAdmin &&
            editCampaignMode
          "
          class="space-y-4"
        >

          <h3 class="text-lg font-bold">
            Kampány beállítások
          </h3>

          <v-text-field
            v-model="
              localContent.campaignSlug
            "
            label="Campaign Slug"
            variant="outlined"
          />

          <v-text-field
            v-model="
              localContent.successSlug
            "
            label="Success Page Slug"
            variant="outlined"
          />

          <div class="flex gap-3">

            <v-btn
              color="success"
              @click="saveCampaign"
            >
              Mentés
            </v-btn>

            <v-btn
              variant="outlined"
              @click="
                editCampaignMode = false
              "
            >
              Mégse
            </v-btn>

          </div>

        </div>

        <!-- DESIGN EDITOR -->
         <div
  v-if="
    isAdmin &&
    editDesignMode
  "
  class="mt-6 p-5 rounded-xl border bg-white shadow-inner space-y-5"
>

  <h3
    class="font-bold text-lg"
  >
    Szakasz stílusbeállításai
  </h3>

  <div>

    <p
      class="text-sm font-semibold mb-2"
    >
      Háttérszín
    </p>

    <div
      class="flex flex-wrap gap-3"
    >

      <button
        v-for="color in brandPaletteColors"
        :key="color"
        class="w-10 h-10 rounded-full border-2"

        :style="{
          backgroundColor: color,

          borderColor:
            localContent.backgroundColor === color
              ? '#000'
              : '#ccc'
        }"

        @click="
          localContent.backgroundColor =
            color
        "
      />

    </div>

  </div>

  <div
    class="flex items-center gap-3"
  >

    <span>
      Egyedi háttér:
    </span>

    <input
      type="color"
      v-model="
        localContent.backgroundColor
      "
    />

  </div>

  <hr>

  <div>

    <p
      class="text-sm font-semibold mb-2"
    >
      Szakasz lezáró él
    </p>

    <div
      class="flex flex-wrap gap-3"
    >

      <button
        class="px-4 py-2 border rounded"
        @click="
          localContent.wave =
            null
        "
      >
        Egyenes él
      </button>

      <button
        v-for="wave in wavePalette"
        :key="wave"

        class="px-4 py-2 border rounded"

        @click="
          localContent.wave =
            wave
        "
      >
        {{ wave }}
      </button>

    </div>

  </div>

  <div
    v-if="localContent.wave"
  >

    <p
      class="text-sm font-semibold mb-2"
    >
      Hullám színe
    </p>

    <input
      type="color"
      v-model="
        localContent.waveColor
      "
    />

  </div>

  <div class="flex gap-3">

    <v-btn
      color="success"
      @click="saveDesign"
    >
      Mentés
    </v-btn>

    <v-btn
      variant="outlined"
      @click="
        editDesignMode = false
      "
    >
      Mégse
    </v-btn>

  </div>

</div>

      </v-card>

    </div>
    <div
  v-if="localContent.wave"

  class="absolute bottom-0 left-0 w-full pointer-events-none z-10 leading-none"

  v-html="coloredWaveSvg"
></div>

  </section>

</template>