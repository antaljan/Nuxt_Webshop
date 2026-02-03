<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2><v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>Coaching Időpontok</h2>
        <div class="d-flex ga-2">
          <v-btn color="secondary" prepend-icon="mdi-layers-plus" @click="openBulkDialog">
            Tömeges generálás
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
            Egyedi időpont
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Statisztikai gyorsnézet -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-card theme="dark" color="surface-variant" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon size="large" color="green" class="mr-3">mdi-check-circle</v-icon>
            <div>
              <div class="text-caption">Szabad időpontok</div>
              <div class="text-h5">{{ slots.filter(s => s.slotClass === 'available').length }} db</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dátum szűrő (Natív naptár választóval) -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filterDate"
          label="Szűrés napra"
          type="date"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          clearable
        />
      </v-col>
    </v-row>

    <v-card elevation="2" border>
      <v-table hover>
        <thead>
          <tr>
            <th>Időpont</th>
            <th>Időtartam</th>
            <th>Státusz</th>
            <th>Ügyfél</th>
            <th class="text-right">Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in filteredSlots" :key="slot._id">
            <td>
              <div class="font-weight-bold">{{ formatDay(slot.start) }}</div>
              <div class="text-caption">{{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}</div>
            </td>
            <td>{{ slot.duration }} perc</td>
            <td>
              <v-chip :color="slot.slotClass === 'available' ? 'green' : 'error'" size="small">
                {{ slot.slotClass === 'available' ? 'Szabad' : 'Foglalt' }}
              </v-chip>
            </td>
            <td>{{ slot.userId ? 'Regisztrált ügyfél' : '-' }}</td>
            <td class="text-right">
              <v-btn icon="mdi-pencil" variant="text" color="blue" size="small" @click="openEditDialog(slot)" />
              <v-btn icon="mdi-delete" variant="text" color="red" size="small" @click="deleteSlotConfirm(slot)" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- TÖMEGES GENERÁLÁS DIALOG -->
    <v-dialog v-model="bulkDialog" max-width="600">
      <v-card>
        <v-toolbar color="secondary" title="Tömeges slot generálás" />
        <v-card-text>
          <v-alert type="info" variant="tonal" class="mb-4" density="compact">
            Példa: Hétfőtől Péntekig 14:00 - 18:00 között 45 perces blokkok.
          </v-alert>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="bulk.startDate" label="Kezdő nap" type="date" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="bulk.endDate" label="Záró nap" type="date" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="bulk.startTime" label="Napi kezdés" type="time" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="bulk.endTime" label="Napi végzés" type="time" />
            </v-col>
            <v-col cols="12">
              <v-slider v-model="bulk.duration" label="Hossz (perc)" min="15" max="120" step="5" thumb-label="always" color="secondary" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="bulkDialog = false">Mégse</v-btn>
          <v-btn color="secondary" prepend-icon="mdi-flash" @click="generateBulkSlots" :loading="loading">Generálás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- EGYEDI SLOT / SZERKESZTÉS DIALOG -->
    <v-dialog v-model="createDialog" max-width="500">
      <v-card>
        <v-card-title>{{ form.id ? 'Szerkesztés' : 'Új időpont' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.title" label="Megnevezés (pl. Coaching)" placeholder="Egyéni konzultáció" />
          <v-text-field v-model="form.date" label="Dátum" type="date" />
          <v-text-field v-model="form.time" label="Kezdés" type="time" />
          <v-text-field v-model="form.duration" label="Hossz (perc)" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="saveSlot" :loading="loading">Mentés</v-btn>
          <v-btn variant="text" @click="createDialog = false">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCoaching } from '~/composables/useCoaching'

const { getAllSlots, createSlot, deleteSlot, updateSlot } = useCoaching()

const slots = ref([])
const filterDate = ref('')
const createDialog = ref(false)
const bulkDialog = ref(false)
const loading = ref(false)

const form = ref({ id: null, title: '', date: '', time: '', duration: 60 })
const bulk = ref({ startDate: '', endDate: '', startTime: '14:00', endTime: '18:00', duration: 45 })

onMounted(loadSlots)

async function loadSlots() {
  slots.value = await getAllSlots()
}

// Formázók
const formatDay = (d) => new Date(d).toLocaleDateString('hu-HU', { weekday: 'short', month: 'short', day: 'numeric' })
const formatTime = (d) => new Date(d).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })

const filteredSlots = computed(() => {
  if (!filterDate.value) return slots.value
  return slots.value.filter(s => s.start.startsWith(filterDate.value))
})

// EGYEDI MENTÉS
function openCreateDialog() {
  form.value = { id: null, title: 'Coaching', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 60 }
  createDialog.value = true
}

async function saveSlot() {
  loading.value = true
  const start = new Date(`${form.value.date}T${form.value.time}`)
  const end = new Date(start.getTime() + form.value.duration * 60000)
  
  const payload = { title: form.value.title, start: start.toISOString(), end: end.toISOString(), duration: form.value.duration }
  
  if (form.value.id) await updateSlot(form.value.id, payload)
  else await createSlot(payload)
  
  createDialog.value = false
  loading.value = false
  await loadSlots()
}

// TÖMEGES GENERÁLÁS LOGIKA
function openBulkDialog() { bulkDialog.value = true }

async function generateBulkSlots() {
  loading.value = true
  const startDay = new Date(bulk.value.startDate)
  const endDay = new Date(bulk.value.endDate)
  
  for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
    // Hétvége kihagyása (opcionális)
    if (d.getDay() === 0 || d.getDay() === 6) continue 

    let current = new Date(`${d.toISOString().split('T')[0]}T${bulk.value.startTime}`)
    const dayEnd = new Date(`${d.toISOString().split('T')[0]}T${bulk.value.endTime}`)

    while (new Date(current.getTime() + bulk.value.duration * 60000) <= dayEnd) {
      const slotEnd = new Date(current.getTime() + bulk.value.duration * 60000)
      await createSlot({
        title: 'Coaching',
        start: current.toISOString(),
        end: slotEnd.toISOString(),
        duration: bulk.value.duration,
        slotClass: 'available'
      })
      // 15 perc szünet a slotok között (opcionális, beállíthatóra is vehetjük)
      current = new Date(slotEnd.getTime() + 5 * 60000) 
    }
  }
  bulkDialog.value = false
  loading.value = false
  await loadSlots()
}

function openEditDialog(slot) {
  const d = new Date(slot.start)
  form.value = {
    id: slot._id,
    title: slot.title,
    date: d.toISOString().split('T')[0],
    time: d.toTimeString().slice(0,5),
    duration: slot.duration
  }
  createDialog.value = true
}

async function deleteSlotConfirm(slot) {
  if (confirm('Biztosan törlöd?')) {
    await deleteSlot(slot._id)
    await loadSlots()
  }
}
</script>
