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
              <v-textarea
                v-model="subject"
                :label="$t('admin.newsletter.form.subject')"
                rows="1"
                variant="outlined"
                bg-color="white"
                auto-grow
                :rules="[v => !!v || 'Title is required']"
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
            <v-list-item-title class="font-bold">{{ template.subject }}</v-list-item-title>
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
import DOMPurify from 'dompurify'
import { renderNewsletterHtml } from '~/utils/newsletter/render'
import ParagraphEditor from '~/components/newsletter/ParagraphEditor.vue'
import { useNewsletter } from '~/composables/useNewsletter'

// === ÚJ: szerkesztő elrejtése/megjelenítése ===
const showEditor = ref(false)
const editedBlock = ref(null)
const editingId = ref(null)

// === ÚJ: sablonlista táblázat fejlécei ===
const templateHeaders = [
  { title: 'Cím', key: 'subject', sortable: true },
  { title: 'Létrehozva', key: 'createdAt', sortable: true },
  { title: 'Műveletek', key: 'actions', sortable: false }
]

// === ÚJ: új sablon indítása ===
function startNewTemplate() {
  subject.value = ''
  structure.value = []
  showEditor.value = true
}

const subject = ref('')
const structure = ref([])
const templates = ref([])
const dialogVisible = ref(false)
const templateDialogVisible = ref(false)
const editedIndex = ref(-1)
const editableTexts = ref([])
const editableLinks = ref([])

// Mocked sablon items
const templateBlocks = [
  { label: "Fejléc", type: "header", defaultProps: { title: "", subtitle: "", logo: "" }},
  { label: "Hero", type: "hero", defaultProps: { title: "", subtitle: "", image: "" }},
  { label: "Cím", type: "title", defaultProps: { text: "" }},
  { label: "Bekezdés", type: "paragraph", defaultProps: { text: "" }},
  { label: "Kép", type: "image", defaultProps: { url: "", alt: "" }},
  { label: "Kép bal", type: "imageLeft", defaultProps: { url: "", alt: "", text: "" }},
  { label: "Kép jobb", type: "imageRight", defaultProps: { url: "", alt: "", text: "" }},
  { label: "Gomb", type: "button", defaultProps: { label: "", url: "" }},
  { label: "Elválasztó", type: "divider", defaultProps: {}},
  { label: "Lábléc", type: "footer", defaultProps: { text: "" }}
]

// Dinamikusan felépített HTML az előnézethez
const renderedHtml = computed(() => {
  const html = renderNewsletterHtml(structure.value)
  return import.meta.client ? DOMPurify.sanitize(html) : html
})

/* ---------------------------
    LOGIKA
--------------------------- */
function insertBlock(item) {
  structure.value.push({
    type: item.type,
    props: JSON.parse(JSON.stringify(item.defaultProps))
  })
}

function removeBlock(index) {
  structure.value.splice(index, 1)
}

function editBlock(index) {
  editedIndex.value = index
  editedBlock.value = JSON.parse(JSON.stringify(structure.value[index]))
  dialogVisible.value = true
}


function saveEditedBlock() {
  if (editedIndex.value === -1) return
  structure.value[editedIndex.value] = JSON.parse(JSON.stringify(editedBlock.value))
  dialogVisible.value = false
}


async function uploadBlockImage(event, index) {
  const file = event.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('image', file)
  
  try {
    const config = useRuntimeConfig()
    const res = await $fetch(`${config.public.backendBase}/upload`, {
      method: 'POST',
      body: formData
    })
    
    // Biztosítsuk a reaktivitást: a splice kényszeríti a Vue-t a frissítésre
    editableLinks.value.splice(index, 1, res.url) 
    
  } catch (err) {
    console.error("Képfeltöltés hiba:", err)
    alert("Hiba a kép feltöltésekor!")
  }
}

//  save newsletter template
const { saveNewsletterTemplate, updateNewsletterTemplate } = useNewsletter()
async function saveNewsletter() {
  const payload = {
    _id: editingId.value,
    subject: subject.value,
    language: "hu",
    blocks: structure.value
  }

  try {
    if (editingId.value) {
      // UPDATE
      await updateNewsletterTemplate(payload)
    } else {
      // CREATE
      await saveNewsletterTemplate(payload)
    }

    alert("Sikeres mentés!")
    loadTemplates()

  } catch (err) {
    console.error("Mentési hiba:", err)
  }
}


async function loadTemplates() {
  const res = await $fetch('/api/newsletter/gettemplates', { method: 'POST' })
  templates.value = res.allNewsletters
}
onMounted(() => {
  loadTemplates()
})

/* ---------------------------
    SABLON BETÖLTÉSE
--------------------------- */
function loadSelectedTemplate(item) {
  editingId.value = item._id
  subject.value = item.subject
  structure.value = JSON.parse(JSON.stringify(item.blocks))
  showEditor.value = true
}

/* ---------------------------
    SABLON TÖRLÉSE
--------------------------- */
async function deleteTemplate(id) {
  if (!confirm("Biztosan törölni szeretnéd ezt a sablont?")) return
  try {
    await $fetch('/api/newsletter/deletetemplate', {
      method: 'POST',
      body: { _id: id }
    })
    // Ha ide eljut, a kérés sikeres volt
    templates.value = templates.value.filter(t => t._id !== id)
    await loadTemplates()
    alert("Sablon törölve!")
  } catch (err) {
    console.error("Hiba a törlés során:", err)
    alert("Nem sikerült a törlés!")
  }
}


/* ---------------------------
    SZERKESZTŐ KIÜRÍTÉSE
--------------------------- */
function clearNewsletter() {
  if (confirm("Biztosan törlöd a jelenlegi munkádat?")) {
    subject.value = ""
    structure.value = []
  }
}
</script>

<style scoped>
.newsletter-preview-container {
  zoom: 0.8; /* Kicsinyítés az átláthatóságért */
  margin: 0 auto;
}
.structure-timeline :deep(.v-timeline-item__body) {
  width: 100%;
}
</style>
