<template>
  <div>

    <!-- TOOLBAR -->
    <div
      class="
        flex
        flex-wrap
        gap-2
        mb-4
        items-center
        bg-gray-50
        p-2
        rounded-lg
        border
      "
    >
      <!-- BOLD -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
          editorInstance
            ?.chain()
            .focus()
            .toggleBold()
            .run()
        "
        :color="
          editorInstance?.isActive('bold')
            ? 'primary'
            : undefined
        "
      >
        <v-icon>
          mdi-format-bold
        </v-icon>
      </v-btn>

      <!-- ITALIC -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
          editorInstance
            ?.chain()
            .focus()
            .toggleItalic()
            .run()
        "
        :color="
          editorInstance?.isActive('italic')
            ? 'primary'
            : undefined
        "
      >
        <v-icon>
          mdi-format-italic
        </v-icon>
      </v-btn>

      <!-- UNDERLINE -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
          editorInstance
            ?.chain()
            .focus()
            .toggleUnderline()
            .run()
        "
        :color="
          editorInstance?.isActive('underline')
            ? 'primary'
            : undefined
        "
      >
        <v-icon>
          mdi-format-underline
        </v-icon>
      </v-btn>

      <!-- ALIGN -->
       <!-- left -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
          editorInstance
            ?.chain()
            .focus()
            .setTextAlign('left')
            .run()
        "
      >
        <v-icon>
          mdi-format-align-left
        </v-icon>
      </v-btn>
      <!-- center -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
            editorInstance
            ?.chain()
            .focus()
            .setTextAlign('center')
            .run()
        "
      >
        <v-icon>
          mdi-format-align-center
        </v-icon>
      </v-btn>
      <!-- right -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
          editorInstance
            ?.chain()
            .focus()
            .setTextAlign('right')
            .run()
        "
      >
        <v-icon>
          mdi-format-align-right
        </v-icon>
      </v-btn>

      <!-- FONT SIZE -->
      <v-select
        class="w-32"
        density="compact"
        hide-details
        label="Méret"
        :items="fontSizes"
        @update:modelValue="
            size =>
                size &&
                editorInstance
                    ?.chain()
                    .focus()
                    .setFontSize(size)
                    .run()
            "
      />

      <!-- FONT FAMILY -->
    <v-select
        class="w-40"
        density="compact"
        hide-details
        label="Betűtípus"
        :items="fontFamilies"
        @update:modelValue="setFontFamily"
    />

      <!-- BRAND COLORS -->
      <div
        class="
          flex
          items-center
          gap-2
        "
      >
        <button
          v-for="
            (color, index) in brandColors
            "
          :key="index"
          class="
            w-6
            h-6
            rounded-full
            border
            shadow-sm
          "
          :style="{
            backgroundColor: color
          }"
          @click="
            applyColor(color)
          "
        />

      </div>

      <!-- CUSTOM COLOR -->
      <div
        class="
          relative
          flex
          items-center
        "
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
          @input="applyCustomColor"
        />
      </div>

      <!-- LINK -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="linkDialog = true"
      >
        <v-icon>
          mdi-link
        </v-icon>
      </v-btn>

      <!-- LINK delete -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="removeLink"
      >
        <v-icon>
          mdi-link-off
        </v-icon>
      </v-btn>

      <!-- BULLET LIST -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
          editorInstance
            ?.chain()
            .focus()
            .toggleBulletList()
            .run()
        "
      >
        <v-icon>
          mdi-format-list-bulleted
        </v-icon>
      </v-btn>

      <!-- ORDERED LIST -->
      <v-btn
        icon
        size="small"
        variant="text"
        @click="
          editorInstance
            ?.chain()
            .focus()
            .toggleOrderedList()
            .run()
        "
      >
        <v-icon>
          mdi-format-list-numbered
        </v-icon>
      </v-btn>

      <!-- LINK DIALOG -->
      <v-dialog
        v-model="linkDialog"
        max-width="500"
      >
      <v-card>
        <v-card-title>
          Link beszúrása
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="linkUrl"
            label="URL"
            placeholder="https://..."
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
           @click="
              linkDialog = false
           "
         >
            Mégse
          </v-btn>
          <v-btn
            color="primary"
           @click="insertLink"
          >
            Mentés
          </v-btn>
          </v-card-actions>
      </v-card>
      </v-dialog>
    </div>

    <!-- EDITOR -->
    <div
      class="
        editor-wrapper
        border
        rounded-lg
        p-3
        bg-white
      "
      :style="{
        minHeight
      }"
    >
      <EditorContent
        v-if="editorInstance"
        :editor="editorInstance"
      />
    </div>

  </div>

</template>

<script setup lang="ts">

import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { FontSize } from '~/components/editor/extensions/FontSize'
import { useBrand } from '@/composables/useBrand'
import { useEditorFonts } from '@/composables/useEditorFonts'

/* -------------------------------------------------------------
   PROPS
------------------------------------------------------------- */

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  minHeight: {
    type: String,
    default: '250px'
  }
})

/* -------------------------------------------------------------
   EMITS
------------------------------------------------------------- */

const emit =
  defineEmits([
    'update:modelValue'
  ])

const minHeight =
  computed(
    () =>
      props.minHeight ??
      '250px'
  )

/* -------------------------------------------------------------
   BRAND COLORS
------------------------------------------------------------- */

const {
  settings,
  loadBrand
} = useBrand()

const brandColors =
  computed(() => [
    settings.value?.primaryColor
      || '#b87d8e',
    settings.value?.accentColor
      || '#1d3557',
    settings.value?.textColor
      || '#2d3142'
  ])

/* -------------------------------------------------------------
   FONTS
------------------------------------------------------------- */

const {
  fontFamilies
} = useEditorFonts()

const fontSizes = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '32px',
  '48px'
]

/* -------------------------------------------------------------
   LINKS
------------------------------------------------------------- */

const linkDialog = ref(false)

const linkUrl = ref('')

/* -------------------------------------------------------------
   EDITOR
------------------------------------------------------------- */

const editorInstance =
  ref<Editor | null>(null)

onMounted(async () => {

  await loadBrand()

  editorInstance.value =
    new Editor({

      content:
        props.modelValue || '',

      extensions: [

        StarterKit,

        TextAlign.configure({
          types: [
            'heading',
            'paragraph'
          ]
        }),

        TextStyle,

        Color,

        FontFamily,

        FontSize as any

      ],

      onUpdate({
        editor
      }) {

        emit(
          'update:modelValue',
          editor.getHTML()
        )

      }

    })

})

onBeforeUnmount(() => {

  editorInstance.value?.destroy()

})

/* -------------------------------------------------------------
   EXTERNAL VALUE CHANGES
------------------------------------------------------------- */

watch(

  () => props.modelValue,

  value => {

    if (
      !editorInstance.value
    ) {
      return
    }

    if (
      value !==
      editorInstance.value.getHTML()
    ) {

      editorInstance.value
        .commands
        .setContent(
          value || ''
        )

    }

  }

)

/* -------------------------------------------------------------
   COLORS
------------------------------------------------------------- */

function applyColor(
  color: string
) {

  editorInstance.value
    ?.chain()
    .focus()
    .setColor(color)
    .run()

}

function applyCustomColor(
  event: Event
) {
  const color = ( event.target as HTMLInputElement ).value
  applyColor(color)
}

function setFontFamily(
  family: string | null
) {

  if (!family) {
    return
  }

  editorInstance.value
    ?.chain()
    .focus()
    .setFontFamily(family)
    .run()

}

function insertLink() {

  if (
    !linkUrl.value.trim()
  ) {
    return
  }

  editorInstance.value
    ?.chain()
    .focus()
    .setLink({
      href: linkUrl.value
    })
    .run()

  linkDialog.value = false

  linkUrl.value = ''

}

function removeLink() {

  editorInstance.value
    ?.chain()
    .focus()
    .unsetLink()
    .run()

}


</script>

<style scoped>

.editor-wrapper :deep(.ProseMirror) {
  min-height: 250px;
  outline: none;
  cursor: text;
}

</style>