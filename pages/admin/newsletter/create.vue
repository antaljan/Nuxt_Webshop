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
                  <div v-html="sanitizedHtml" class="newsletter-preview-container" />
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
          <div v-if="editableTexts.length > 0">
            <p class="font-bold mb-2">✏️ Szövegek</p>
            <v-text-field
              v-for="(text, i) in editableTexts"
              :key="'text-'+i"
              v-model="editableTexts[i]"
              variant="outlined"
              density="compact"
              class="mb-2"
            />
          </div>
          <div v-if="editableLinks.length > 0" class="mt-4">
            <p class="font-bold mb-2">🔗 Linkek & Képek</p>
            <div v-for="(link, i) in editableLinks" :key="'link-'+i" class="mb-4 p-3 border rounded-lg bg-gray-50">
              <v-text-field v-model="editableLinks[i]" label="URL / Link" variant="outlined" density="compact" />
              <input type="file" @change="e => uploadBlockImage(e, i)" class="text-xs" />
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

// === ÚJ: szerkesztő elrejtése/megjelenítése ===
const showEditor = ref(false)

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


// Import of templates
import { bodyImgL } from '~/utils/newsletter/TemplateBodyImgL'
import { bodyImgC } from '~/utils/newsletter/TemplateBodyImgC'
import { bodyTextImgL } from '~/utils/newsletter/TemplateBodyTextImgL'
import { bodyTextImgR } from '~/utils/newsletter/TemplateBodyTextImgR'
import { headerHTML } from '~/utils/newsletter/TemplateHeader'
import { heroHTML } from '~/utils/newsletter/TemplateHero'
import { BodyTextL } from '~/utils/newsletter/TemplateBodyTextL'
import { BodyTextC } from '~/utils/newsletter/TemplateBodyTextC'
import { BodyTextBL } from '~/utils/newsletter/TemplateBodyTextBL'
import { BodyTextBC } from '~/utils/newsletter/TemplateBodyTextBC'
import { BodyCtaC } from '~/utils/newsletter/TemplateCtaC'
import { BodyCtaL } from '~/utils/newsletter/TemplateCtaL'
import { footerHTML } from '~/utils/newsletter/TemplateFooter'

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
  { label: 'Fejléc', HTML: headerHTML },
  { label: 'Lábléc', HTML: footerHTML },
  { label: 'Hero', HTML: heroHTML },
  { label: 'cím közép', HTML: BodyTextBC },
  { label: 'cím ball', HTML: BodyTextBL },
  { label: 'szöveg közép', HTML: BodyTextC },
  { label: 'szöveg ball', HTML: BodyTextL },
  { label: 'kép közép', HTML: bodyImgC },
  { label: 'kép ball', HTML: bodyImgL },
  { label: 'kép&szöveg ball', HTML: bodyTextImgL },
  { label: 'kép&szöveg jobb', HTML: bodyTextImgR },
  { label: 'gomb közép', HTML: BodyCtaC },
  { label: 'gomb ball', HTML: BodyCtaL },
]

// Dinamikusan felépített HTML az előnézethez
const sanitizedHtml = computed(() => {
  const fullHtml = structure.value.map(block => block.HTML).join('')
  if (import.meta.client) {
    return DOMPurify.sanitize(fullHtml)
  }
  return fullHtml
})


/* ---------------------------
    LOGIKA
--------------------------- */
function insertBlock(item) {
  structure.value.push({ ...item })
}

function removeBlock(index) {
  structure.value.splice(index, 1)
}

function editBlock(index) {
  editedIndex.value = index
  const block = structure.value[index]
  
  // 1. Szövegek kinyerése (Minden, ami > és < között van, de nem csak whitespace)
  const textRegex = />([^<>\n]+)</g
  editableTexts.value = []
  let match
  while ((match = textRegex.exec(block.HTML)) !== null) {
    const text = match[1].trim()
    if (text) editableTexts.value.push(text)
  }

  // 2. Linkek/Képek kinyerése (href és src attribútumok)
  const linkRegex = /(?:href|src)="([^"]+)"/g
  editableLinks.value = []
  while ((match = linkRegex.exec(block.HTML)) !== null) {
    editableLinks.value.push(match[1])
  }
  
  dialogVisible.value = true
}

function saveEditedBlock() {
  if (editedIndex.value === -1) return
    let newHTML = structure.value[editedIndex.value].HTML
  // Szövegek visszacserélése
  const textRegex = />([^<>\n]+)</g
  let textIdx = 0
  newHTML = newHTML.replace(textRegex, (match, p1) => {
    const originalTrimmed = p1.trim()
    if (originalTrimmed && editableTexts.value[textIdx] !== undefined) {
      return `>${editableTexts.value[textIdx++]}<`
    }
    return match
  })
  // Linkek visszacserélése
  const linkRegex = /(?:href|src)="([^"]+)"/g
  let linkIdx = 0
  newHTML = newHTML.replace(linkRegex, (match) => {
    const attr = match.startsWith('href') ? 'href' : 'src'
    if (editableLinks.value[linkIdx] !== undefined) {
      return `${attr}="${editableLinks.value[linkIdx++]}"`
    }
    return match
  })
  structure.value[editedIndex.value].HTML = newHTML
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
const { saveNewsletterTemplate } = useNewsletter() // Emeld be a composable-ből
async function saveNewsletter() {
  const payload = {
    subject: subject.value,
    fullHtml: sanitizedHtml.value,
    structure: JSON.parse(JSON.stringify(structure.value)),
    sendDate: new Date().toISOString()
  }
  try {
    const res = await saveNewsletterTemplate(payload)
    alert("✅ Mentve!")
    await clearNewsletter()
    await loadTemplates()
  } catch (err) {
    console.error("Mentési hiba:", err)
        if (err.data) {
      console.log("Backend hiba részletei:", err.data)
    }
    alert("❌ Mentési hiba! Ellenőrizd a konzolt.")
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
async function loadSelectedTemplate(template) {
  showEditor.value = true
  try {
    subject.value = template.subject;
    if (template.structure) {
      structure.value = JSON.parse(JSON.stringify(template.structure));
    }
    templateDialogVisible.value = false;
  } catch (err) {
    console.error("Hiba a sablon betöltésekor:", err);
  }
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
