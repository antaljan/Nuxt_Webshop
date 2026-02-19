<template>
  <div class="paragraph-editor">
    <div class="toolbar">
      <v-btn
        icon="mdi-format-bold"
        variant="text"
        @click="toggleBold"
        :color="editor?.isActive('bold') ? 'primary' : ''"
      />
      <v-btn
        icon="mdi-format-italic"
        variant="text"
        @click="toggleItalic"
        :color="editor?.isActive('italic') ? 'primary' : ''"
      />
      <v-btn
        icon="mdi-format-underline"
        variant="text"
        @click="toggleUnderline"
        :color="editor?.isActive('underline') ? 'primary' : ''"
      />
      <v-btn
        icon="mdi-link"
        variant="text"
        @click="setLink"
      />
      <v-btn
        icon="mdi-link-off"
        variant="text"
        @click="unsetLink"
      />
    </div>

    <div class="editor-container">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = new Editor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({
      openOnClick: true,
      autolink: true
    })
  ],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  }
})

function toggleBold() {
  editor.chain().focus().toggleBold().run()
}

function toggleItalic() {
  editor.chain().focus().toggleItalic().run()
}

function toggleUnderline() {
  editor.chain().focus().toggleUnderline().run()
}

function setLink() {
  const url = prompt('Add meg a link URL-jét:')
  if (url) {
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

function unsetLink() {
  editor.chain().focus().unsetLink().run()
}

onBeforeUnmount(() => {
  editor.destroy()
})
</script>

<style scoped>
.paragraph-editor {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.toolbar {
  display: flex;
  gap: 4px;
  padding: 6px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}

.editor-container {
  padding: 12px;
  min-height: 120px;
}

.editor-container :deep(.ProseMirror) {
  outline: none;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
</style>
