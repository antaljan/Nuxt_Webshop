<script setup>
const props = defineProps({
  section: Object
})

const emit = defineEmits(['update'])

// 🔥 Lokális másolat
const local = reactive(JSON.parse(JSON.stringify(props.section)))

watch(local, () => {
  emit('update', local)
}, { deep: true })

// 🔥 Mezők definíciója — összhangban a SectionBuilder defaultProps-szal
const fieldsByType = {
  hero: [
    { key: 'title', label: 'Cím', type: 'text' },
    { key: 'subtitle', label: 'Alcím', type: 'text' },
    { key: 'bullets', label: 'Bullet pontok (soronként egy)', type: 'textarea' },
    { key: 'image', label: 'Kép', type: 'image' }
  ],

  text: [
    { key: 'title', label: 'Cím', type: 'text' },
    { key: 'paragraphs', label: 'Bekezdések (soronként egy)', type: 'textarea' }
  ],

  imageText: [
    { key: 'title', label: 'Cím', type: 'text' },
    { key: 'text', label: 'Szöveg', type: 'textarea' },
    { key: 'image', label: 'Kép', type: 'image' }
  ],

  feedback: [
    { key: 'title', label: 'Cím', type: 'text' },
    { key: 'items', label: 'Vélemények (soronként egy)', type: 'textarea' }
  ],

  contact: [
    { key: 'title', label: 'Cím', type: 'text' },
    { key: 'description', label: 'Leírás', type: 'textarea' }
  ]
}
</script>

<template>
  <div>
    <div v-for="field in fieldsByType[local.type]" :key="field.key" class="mb-4">

      <!-- Text input -->
      <v-text-field
        v-if="field.type === 'text'"
        v-model="local.props[field.key]"
        :label="field.label"
      />

      <!-- Textarea -->
      <v-textarea
        v-if="field.type === 'textarea'"
        v-model="local.props[field.key]"
        :label="field.label"
        rows="5"
      />

      <!-- Image upload -->
      <FileUpload
        v-if="field.type === 'image'"
        v-model="local.props[field.key]"
        :label="field.label"
      />

    </div>
  </div>
</template>
