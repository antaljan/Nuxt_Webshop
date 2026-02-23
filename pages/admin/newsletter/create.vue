<template>
  <section class="p-4 bg-gray-50 min-h-screen">
    <v-container fluid>

      <!-- BACK BUTTON -->
      <v-btn
        color="primary"
        variant="text"
        prepend-icon="mdi-arrow-left"
        to="/admin/newsletter"
        class="mb-4"
      >
        Vissza a hírlevelekhez
      </v-btn>

      <!-- TEMPLATE LIST -->
      <v-card class="mb-6 rounded-xl shadow-sm">
        <v-card-title class="flex justify-between items-center">
          <span class="text-lg font-bold">Mentett sablonok</span>

          <v-btn
            color="success"
            prepend-icon="mdi-plus"
            @click="startNewTemplate"
          >
            Új sablon
          </v-btn>
        </v-card-title>

        <v-data-table
          :headers="templateHeaders"
          :items="templates"
          :items-per-page="5"
          class="border-t"
        >
          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              color="blue"
              @click="loadSelectedTemplate(item)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="red"
              @click="deleteTemplate(item._id)"
            />
          </template>
        </v-data-table>
      </v-card>

      <!-- EDITOR (HIDEABLE) -->
      <v-expand-transition>
        <div v-if="showEditor">

          <!-- ======= A TE EREDETI SZERKESZTŐD ======= -->

          <!-- HEADER & SUBJECT -->
          <v-row class="align-center mb-6">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="title"
                label="Sablon neve"
                variant="outlined"
                bg-color="white"
                class="mb-4"
                :rules="[v => !!v || 'A sablon neve kötelező']"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-textarea
                v-model="subject"
                :label="$t('admin.newsletter.form.subject')"
                rows="1"
                variant="outlined"
                bg-color="white"
                auto-grow
                :rules="[v => !!v || 'Tárgy megadása kötelező']"
              />
            </v-col>
            <v-col cols="12" md="4" class="text-right">
              <v-btn color="secondary" prepend-icon="mdi-folder-open" size="large" @click="templateDialogVisible = true">
                {{ $t('admin.newsletter.templates') }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <!-- LEFT COLUMN -->
            <v-col cols="12" md="9">

              <!-- BLOCK TOOLBAR -->
              <v-card class="mb-6 rounded-xl shadow-sm">
                <v-card-title class="bg-blue-darken-3 text-white text-subtitle-1 py-2">
                  <v-icon start size="small">mdi-view-grid-plus</v-icon> Sablon-elemek
                </v-card-title>
                <v-card-text class="p-4 flex flex-wrap gap-2">
                  <v-btn
                    v-for="(item, index) in templateBlocks"
                    :key="index"
                    @click="insertBlock(item)"
                    variant="tonal"
                    color="blue-darken-2"
                    size="small"
                    rounded="lg"
                  >
                    {{ item.label }}
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- PREVIEW -->
              <v-card class="rounded-xl shadow-md overflow-hidden">
                <v-card-title class="bg-grey-darken-3 text-white flex justify-between align-center">
                  <span>📬 Előnézet</span>
                  <div class="flex gap-2">
                    <v-btn color="success" size="small" @click="saveNewsletter" :disabled="!subject">
                      Mentés
                    </v-btn>
                    <v-btn color="error" variant="text" size="small" @click="clearNewsletter">
                      Törlés
                    </v-btn>
                  </div>
                </v-card-title>
                <v-card-text class="p-0 bg-white min-h-[600px] border-x">
                  <div v-html="renderedHtml" class="newsletter-preview-container" />
                </v-card-text>
              </v-card>

            </v-col>

            <!-- RIGHT COLUMN -->
            <v-col cols="12" md="3">
              <v-card class="rounded-xl shadow-sm sticky top-4">
                <v-card-title class="text-subtitle-1 border-b">Sablon szerkezete</v-card-title>
                <v-card-text class="p-4">
                  <div v-if="structure.length === 0" class="text-center py-8 text-gray-400 italic">
                    Nincs még blokk hozzáadva
                  </div>

                  <v-timeline side="end" align="start" density="compact" class="structure-timeline">
                    <v-timeline-item
                      v-for="(block, index) in structure"
                      :key="index"
                      size="x-small"
                      dot-color="blue"
                    >
                      <div class="flex justify-between items-center w-full">
                        <span class="text-xs font-bold truncate pr-2">{{ block.label }}</span>
                        <div class="flex">
                          <v-btn icon="mdi-pencil" variant="text" size="x-small" @click="editBlock(index)" />
                          <v-btn icon="mdi-delete" variant="text" size="x-small" color="red" @click="removeBlock(index)" />
                        </div>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

    <!-- DIALOG: BLOCK EDITOR -->
    <v-dialog v-model="dialogVisible" max-width="600px" persistent>
      <v-card rounded="xl">
        <v-card-title class="bg-blue-darken-3 text-white">Blokk szerkesztése</v-card-title>
        <v-card-text class="py-6">
          <!-- TipTap editor csak paragraph esetén -->
          <ParagraphEditor
            v-if="editedBlock?.type === 'paragraph'"
            v-model="editedBlock.props.text"
          />
          <!-- Minden más blokk: egyszerű input mezők -->
          <div v-else>
            <div
              v-for="(value, key) in editedBlock.props"
              :key="key"
              class="mb-4"
            >
              <v-text-field
                v-model="editedBlock.props[key]"
                :label="key"
                variant="outlined"
                density="compact"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="p-4">
          <v-spacer />
          <v-btn variant="text" @click="dialogVisible = false">Mégse</v-btn>
          <v-btn color="primary" @click="saveEditedBlock">Alkalmaz</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG: TEMPLATES LIST -->
    <v-dialog v-model="templateDialogVisible" max-width="700px">
      <v-card rounded="xl">
        <v-card-title class="border-b">Mentett sablonok</v-card-title>
        <v-list lines="two" class="max-h-[500px] overflow-y-auto">
          <v-list-item v-for="template in templates" :key="template._id">
            <template v-slot:prepend>
              <v-icon icon="mdi-email-outline" />
            </template>
            <v-list-item-title class="font-bold">
              {{ template.title || template.subject }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ new Date(template.createdAt).toLocaleDateString() }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn icon="mdi-download" variant="text" color="blue" @click="loadSelectedTemplate(template)" />
              <v-btn icon="mdi-delete" variant="text" color="red" @click="deleteTemplate(template._id)" />
            </template>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="templateDialogVisible = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

        </div>
      </v-expand-transition>

    </v-container>
  </section>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import DOMPurify from 'dompurify'
import ParagraphEditor from '~/components/newsletter/ParagraphEditor.vue'
import { useNewsletter } from '~/composables/useNewsletter'
import { renderNewsletterPreview } from '~/utils/newsletter/render'

/* ---------------------------------------------
   API HOOKS
--------------------------------------------- */
const {
  fetchTemplates,
  saveNewsletterTemplate,
  updateNewsletterTemplate,
  deleteTemplateById
} = useNewsletter()

/* ---------------------------------------------
   STATE
--------------------------------------------- */
const showEditor = ref(false)
const title = ref('')        // ÚJ: sablon neve
const subject = ref('')      // email tárgya
const structure = ref([])    // JSON blocks
const templates = ref([])

const dialogVisible = ref(false)
const templateDialogVisible = ref(false)

const editedBlock = ref(null)
const editedBlockIndex = ref(null)
const editingId = ref(null)
const isLoadingTemplate = ref(false)

/* ---------------------------------------------
   TEMPLATE LIST HEADERS
--------------------------------------------- */
const templateHeaders = [
  { title: 'Név', key: 'title', sortable: true },
  { title: 'Tárgy', key: 'subject', sortable: true },
  { title: 'Létrehozva', key: 'createdAt', sortable: true },
  { title: 'Műveletek', key: 'actions', sortable: false }
]

/* ---------------------------------------------
   BLOCK TYPES
--------------------------------------------- */
const templateBlocks = [
  { label: "Fejléc", type: "header", props: { title: "", subtitle: "", logo: "" }},
  { label: "Hero", type: "hero", props: { title: "", subtitle: "", image: "" }},
  { label: "Cím", type: "title", props: { text: "" }},
  { label: "Bekezdés", type: "paragraph", props: { text: "" }},
  { label: "Kép", type: "image", props: { url: "", alt: "" }},
  { label: "Kép bal", type: "imageLeft", props: { url: "", alt: "", text: "" }},
  { label: "Kép jobb", type: "imageRight", props: { url: "", alt: "", text: "" }},
  { label: "Gomb", type: "button", props: { label: "", url: "" }},
  { label: "Elválasztó", type: "divider", props: {}},
  { label: "Lábléc", type: "footer", props: { text: "" }}
]

/* ---------------------------------------------
   LOAD TEMPLATES
--------------------------------------------- */
async function loadTemplates() {
  const res = await fetchTemplates()
  templates.value = res.allNewsletters || []
}
onMounted(loadTemplates)

/* ---------------------------------------------
   START NEW TEMPLATE
--------------------------------------------- */
function startNewTemplate() {
  editingId.value = null
  title.value = ''
  subject.value = ''
  structure.value = []
  showEditor.value = true
}

/* ---------------------------------------------
   LOAD SELECTED TEMPLATE
--------------------------------------------- */
async function loadSelectedTemplate(item) {
  isLoadingTemplate.value = true
  editingId.value = item._id

  title.value = item.title || ''     // ÚJ
  subject.value = item.subject || ''
  structure.value = Array.isArray(item.blocks)
    ? JSON.parse(JSON.stringify(item.blocks))
    : []

  showEditor.value = true
  templateDialogVisible.value = false
  isLoadingTemplate.value = false
}

/* ---------------------------------------------
   INSERT BLOCK
--------------------------------------------- */
function insertBlock(item) {
  structure.value.push({
    type: item.type,
    props: JSON.parse(JSON.stringify(item.props))
  })
}

/* ---------------------------------------------
   EDIT BLOCK
--------------------------------------------- */
function editBlock(index) {
  editedBlockIndex.value = index
  editedBlock.value = JSON.parse(JSON.stringify(structure.value[index]))
  dialogVisible.value = true
}

function saveEditedBlock() {
  structure.value[editedBlockIndex.value] = JSON.parse(JSON.stringify(editedBlock.value))
  dialogVisible.value = false
}

/* ---------------------------------------------
   REMOVE BLOCK
--------------------------------------------- */
function removeBlock(index) {
  structure.value.splice(index, 1)
}

/* ---------------------------------------------
   CLEAR TEMPLATE
--------------------------------------------- */
function clearNewsletter() {
  if (confirm("Biztosan törlöd a jelenlegi munkádat?")) {
    title.value = ""
    subject.value = ""
    structure.value = []
  }
}

/* ---------------------------------------------
   SAVE TEMPLATE (CREATE OR UPDATE)
--------------------------------------------- */
async function saveNewsletter() {
  const payload = {
    _id: editingId.value,
    title: title.value,        // ÚJ
    subject: subject.value,
    language: "hu",
    blocks: structure.value
  }

  try {
    if (editingId.value) {
      await updateNewsletterTemplate(payload)
    } else {
      await saveNewsletterTemplate(payload)
    }

    alert("Sikeres mentés!")
    await loadTemplates()

  } catch (err) {
    console.error("Mentési hiba:", err)
    alert("Nem sikerült menteni!")
  }
}

/* ---------------------------------------------
   DELETE TEMPLATE
--------------------------------------------- */
async function deleteTemplate(id) {
  if (!confirm("Biztosan törlöd a sablont?")) return

  await deleteTemplateById(id)
  await loadTemplates()
}

/* ---------------------------------------------
   LIVE PREVIEW
--------------------------------------------- */
const renderedHtml = ref('')

watch([subject, structure], async () => {
  if (isLoadingTemplate.value) return
  if (!Array.isArray(structure.value)) {
    renderedHtml.value = ''
    return
  }

  if (!subject.value && structure.value.length === 0) {
    renderedHtml.value = ''
    return
  }

  const html = await renderNewsletterPreview({
    blocks: structure.value,
    subscriber: {
      firstname: 'Teszt',
      name: 'Felhasználó',
      email: 'test@example.com'
    }
  })

  renderedHtml.value = DOMPurify.sanitize(html)
}, { deep: true })
</script>
