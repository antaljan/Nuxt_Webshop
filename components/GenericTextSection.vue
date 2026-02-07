<template>
  <section :id="sectionKey" class="py-16">
    <div class="container mx-auto max-w-4xl">

      <!-- TITLE -->
      <h2 class="text-2xl font-semibold text-center mb-6">
        {{ localContent.title }}
      </h2>

      <!-- PARAGRAPHS -->
      <div class="space-y-3 text-base leading-snug">
        <p
          v-for="(p, index) in localContent.paragraphs"
          :key="index"
        >
          {{ p }}
        </p>
      </div>

      <!-- ADMIN: EDITOR TOGGLE -->
      <div v-if="isAdmin" class="text-center mt-8">
        <v-btn color="primary" @click="showEditor = !showEditor">
          {{ showEditor ? 'Close Editor' : 'Edit Section' }}
        </v-btn>
      </div>

      <!-- ADMIN: EDITOR PANEL -->
      <v-form
        v-if="showEditor"
        class="pa-4 mt-6 bg-white rounded-lg shadow"
      >
        <v-text-field
          v-model="localContent.title"
          label="Title"
        />

        <!-- Dynamic paragraphs -->
        <div
          v-for="(p, index) in localContent.paragraphs"
          :key="index"
          class="mb-4"
        >
          <v-textarea
            v-model="localContent.paragraphs[index]"
            :label="'Paragraph ' + (index + 1)"
            auto-grow
          />

          <v-btn
            color="error"
            variant="text"
            @click="removeParagraph(index)"
          >
            Delete paragraph
          </v-btn>
        </div>

        <v-btn
          color="secondary"
          class="mb-4"
          @click="addParagraph"
        >
          + Add paragraph
        </v-btn>

        <v-btn
          color="primary"
          class="mt-4"
          @click="saveContent"
        >
          Save Content
        </v-btn>
      </v-form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

/* ---------------------------
   PROPS
--------------------------- */
const props = defineProps({
  content: { type: Object, required: true },
  sectionKey: { type: String, required: true }
})

/* ---------------------------
   AUTH
--------------------------- */
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')

/* ---------------------------
   LOCAL COPY OF CONTENT
--------------------------- */
const localContent = ref({})
watch(
  () => props.content,
  (val) => {
    if (val) localContent.value = structuredClone(val)
  },
  { immediate: true }
)

/* ---------------------------
   PARAGRAPH CONTROLS
--------------------------- */
function addParagraph() {
  localContent.value.paragraphs.push('')
}

function removeParagraph(index) {
  localContent.value.paragraphs.splice(index, 1)
}

/* ---------------------------
   SAVE CONTENT
--------------------------- */
const { locale } = useI18n()

async function saveContent() {
  try {
    await $fetch(`/api/content/${props.sectionKey}/${locale.value}`, {
      method: 'PUT',
      body: localContent.value
    })
    alert('Content saved!')
  } catch (err) {
    console.error('Saving content failed:', err)
    alert('Error saving content')
  }
}

/* ---------------------------
   ADMIN EDITOR TOGGLE
--------------------------- */
const showEditor = ref(false)
</script>
