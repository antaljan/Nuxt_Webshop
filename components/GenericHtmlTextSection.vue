<template>
  <section class="max-w-4xl mx-auto py-10 px-4">
    <!-- Admin mód: TipTap editor -->
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

    <!-- Publikus mód: HTML render -->
    <div
      v-else
      class="prose max-w-none"
      v-html="sanitizedHtml"
    />

    <!-- Admin: Edit gomb -->
    <div v-if="isAdmin && !editMode" class="mt-6">
      <v-btn color="primary" @click="editMode = true">
        {{ t('common.edit') }}
      </v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import DOMPurify from 'dompurify'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useContent } from '~/composables/useContent'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
const { t, locale } = useI18n()
const props = defineProps<{
  section: string
}>()

const { user } = useAuth()
const { getSection, updateSection } = useContent()

const isAdmin = computed(() => user.value?.role === 'admin')
const editMode = ref(false)
const localContent = ref<string>('')

const editor = ref(null)

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

// SSR content load
const { data: content } = await useAsyncData(
  `content-${props.section}-${locale.value}`,
  () => getSection(props.section, locale.value)
)

localContent.value = content.value?.html || ''

const sanitizedHtml = computed(() => {
  if (process.server) {
    return localContent.value
  }
  return DOMPurify.sanitize(localContent.value)
})


const saveContent = async () => {
  await updateSection(props.section, locale.value, { html: localContent.value })
  editMode.value = false
}

const cancelEdit = () => {
  localContent.value = content.value?.html || ''
  editMode.value = false
}
</script>
