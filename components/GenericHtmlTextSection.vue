<template>
  <section class="max-w-4xl mx-auto py-10 px-4">
    <div v-if="isAdmin && editMode">
        <div class="editor-wrapper border rounded-lg p-2 bg-white min-h-[300px]">
            <EditorContent :editor="editor" />
        </div>

      <div class="flex gap-4 mt-4">
        <v-btn color="primary" @click="saveContent">
          {{ t('common.save') }}
        </v-btn>
        <v-btn color="secondary" @click="cancelEdit">
          {{ t('common.cancel') }}
        </v-btn>
      </div>
    </div>

    <div
      v-else
      class="prose max-w-none"
      v-html="sanitizedHtml"
    />

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

const { t, locale } = useI18n()

// EGYSÉGESÍTÉS: section -> sectionKey, és opcionális content prop
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

// Tartalom betöltése: ha nincs propban kapott tartalom, lekérjük
const { data: fetchedContent } = await useAsyncData(
  `content-${props.sectionKey}-${locale.value}`,
  () => props.content ? Promise.resolve(props.content) : getSection(props.sectionKey, locale.value),
  { watch: [locale] }
)

// Reaktív tartalomkezelés
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
    extensions: [StarterKit],
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
  return DOMPurify.sanitize(localContent.value)
})

const saveContent = async () => {
  // A backend updateSection-nek is a sectionKey-t adjuk át
  await updateSection(props.sectionKey, locale.value, { html: localContent.value })
  editMode.value = false
}

const cancelEdit = () => {
  localContent.value = activeContent.value?.html || ''
  editor.value?.commands.setContent(localContent.value)
  editMode.value = false
}
</script>