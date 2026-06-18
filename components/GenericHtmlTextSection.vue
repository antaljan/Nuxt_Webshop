<template>
  <section class="max-w-4xl mx-auto py-10 px-4">

    <!-- ADMIN EDITOR -->
    <div v-if="isAdmin && editMode">

<!-- Toolbar -->
<div class="flex flex-wrap gap-2 mb-4 items-center">

  <!-- Bold -->
  <v-btn
    icon
    size="small"
    variant="text"
    @click="editor.chain().focus().toggleBold().run()"
    :color="editor.isActive('bold') ? 'primary' : ''"
  >
    <v-icon>mdi-format-bold</v-icon>
  </v-btn>

  <!-- Italic -->
  <v-btn
    icon
    size="small"
    variant="text"
    @click="editor.chain().focus().toggleItalic().run()"
    :color="editor.isActive('italic') ? 'primary' : ''"
  >
    <v-icon>mdi-format-italic</v-icon>
  </v-btn>

  <!-- Undo -->
  <v-btn
    icon
    size="small"
    variant="text"
    @click="editor.chain().focus().undo().run()"
  >
    <v-icon>mdi-undo</v-icon>
  </v-btn>

  <!-- Redo -->
  <v-btn
    icon
    size="small"
    variant="text"
    @click="editor.chain().focus().redo().run()"
  >
    <v-icon>mdi-redo</v-icon>
  </v-btn>

  <!-- Align Left -->
  <v-btn
    icon
    size="small"
    variant="text"
    @click="editor.chain().focus().setTextAlign('left').run()"
    :color="editor.isActive({ textAlign: 'left' }) ? 'primary' : ''"
  >
    <v-icon>mdi-format-align-left</v-icon>
  </v-btn>

  <!-- Align Center -->
  <v-btn
    icon
    size="small"
    variant="text"
    @click="editor.chain().focus().setTextAlign('center').run()"
    :color="editor.isActive({ textAlign: 'center' }) ? 'primary' : ''"
  >
    <v-icon>mdi-format-align-center</v-icon>
  </v-btn>

  <!-- Align Right -->
  <v-btn
    icon
    size="small"
    variant="text"
    @click="editor.chain().focus().setTextAlign('right').run()"
    :color="editor.isActive({ textAlign: 'right' }) ? 'primary' : ''"
  >
    <v-icon>mdi-format-align-right</v-icon>
  </v-btn>

  <!-- Font size -->
  <v-select
    class="w-32"
    density="compact"
    :items="fontSizes"
    label="Méret"
    prepend-inner-icon="mdi-format-size"
    @update:modelValue="size => editor.chain().focus().setFontSize(size).run()"
  />

  <!-- Font family -->
  <v-select
    class="w-40"
    density="compact"
    :items="fontFamilies"
    label="Betűtípus"
    prepend-inner-icon="mdi-format-font"
    @update:modelValue="family => editor.chain().focus().setFontFamily(family).run()"
  />

  <!-- Color -->
<div class="relative flex items-center">
  <v-btn
    icon
    size="small"
    variant="text"
  >
    <v-icon>mdi-format-color-text</v-icon>
  </v-btn>

  <input
    type="color"
    class="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer"
    @input="e => editor.chain().focus().setColor(e.target.value).run()"
  />
</div>

</div>

      <!-- Editor -->
      <div class="editor-wrapper border rounded-lg p-2 bg-white min-h-[300px]">
        <EditorContent :editor="editor" />
      </div>

      <!-- Buttons -->
      <div class="flex gap-4 mt-4">
        <v-btn color="primary" @click="saveContent">
          {{ t('common.save') }}
        </v-btn>
        <v-btn color="secondary" @click="cancelEdit">
          {{ t('common.cancel') }}
        </v-btn>
      </div>
    </div>

    <!-- PUBLIC VIEW -->
    <div
      v-else
      class="prose max-w-none"
      v-html="sanitizedHtml"
    />

    <!-- EDIT BUTTON -->
    <div v-if="isAdmin && !editMode" class="mt-6">
      <v-btn color="primary" @click="editMode = true">
        {{ t('common.edit') }}
      </v-btn>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useContent } from '~/composables/useContent'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { FontSize } from '~/components/editor/extensions/FontSize'

const { t, locale } = useI18n()

const props = defineProps<{
  sectionKey: string,
  content?: any
}>()

const { user } = useAuth()
const { getSection, updateSection } = useContent()

const isAdmin = computed(() => user.value?.role === 'admin')
const editMode = ref(false)
const localContent = ref<string>('')

const editor = ref<Editor | null>(null)

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px']
const fontFamilies = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Tahoma',
  'Courier New'
]

// Content loading
const { data: fetchedContent } = await useAsyncData(
  `content-${props.sectionKey}-${locale.value}`,
  () => props.content ? Promise.resolve(props.content) : getSection(props.sectionKey, locale.value),
  { watch: [locale] }
)

const activeContent = computed(() => props.content || fetchedContent.value)

watch(activeContent, (newVal) => {
  if (newVal?.html) {
    localContent.value = newVal.html
    editor.value?.commands.setContent(newVal.html)
  }
}, { immediate: true })

onMounted(() => {
  editor.value = new Editor({
    content: localContent.value,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize
    ],
    onUpdate: ({ editor: e }) => {
      localContent.value = e.getHTML()
    }
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const sanitizedHtml = computed(() => {
  if (process.server) return localContent.value
  return DOMPurify.sanitize(localContent.value, {
    ALLOWED_ATTR: ['style', 'class']
  })
})

const saveContent = async () => {
  await updateSection(props.sectionKey, locale.value, { html: localContent.value })
  editMode.value = false
}

const cancelEdit = () => {
  localContent.value = activeContent.value?.html || ''
  editor.value?.commands.setContent(localContent.value)
  editMode.value = false
}
</script>

<style scoped>
.editor-wrapper :deep(.ProseMirror) {
  min-height: 250px;
  outline: none;
}
</style>
