<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2>Coaching időpontok kezelése</h2>
        <v-btn color="primary" @click="openCreateDialog">
          Új időpont hozzáadása
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dátum szűrő -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filterDate"
          label="Szűrés dátum szerint (YYYY-MM-DD)"
          prepend-inner-icon="mdi-calendar"
          clearable
        />
      </v-col>
    </v-row>

    <!-- Slot lista -->
    <v-card>
      <v-table>
        <thead>
          <tr>
            <th>Cím</th>
            <th>Kezdés</th>
            <th>Vége</th>
            <th>Státusz</th>
            <th>Felhasználó</th>
            <th>Műveletek</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="slot in filteredSlots" :key="slot._id">
            <td>{{ slot.title }}</td>
            <td>{{ format(slot.start) }}</td>
            <td>{{ format(slot.end) }}</td>
            <td>
              <v-chip :color="slot.slotClass === 'available' ? 'green' : 'red'" dark>
                {{ slot.slotClass }}
              </v-chip>
            </td>
            <td>
              <span v-if="slot.userId">Foglalva</span>
              <span v-else>-</span>
            </td>

            <td>
              <v-btn icon color="blue" @click="openEditDialog(slot)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn icon color="red" @click="deleteSlotConfirm(slot)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Új slot dialog -->
    <v-dialog v-model="createDialog" max-width="500">
      <v-card>
        <v-card-title>Új időpont létrehozása</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.title" label="Cím" />
          <v-text-field v-model="form.start" label="Kezdés (ISO dátum)" />
          <v-text-field v-model="form.duration" label="Időtartam (perc)" type="number" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="green" @click="saveNewSlot">Mentés</v-btn>
          <v-btn color="red" @click="createDialog = false">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Szerkesztés dialog -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Időpont szerkesztése</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.title" label="Cím" />
          <v-text-field v-model="form.start" label="Kezdés (ISO dátum)" />
          <v-text-field v-model="form.end" label="Vége (ISO dátum)" />
          <v-select
            v-model="form.slotClass"
            :items="['available', 'booked']"
            label="Státusz"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="green" @click="saveEditSlot">Mentés</v-btn>
          <v-btn color="red" @click="editDialog = false">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCoaching } from '~/composables/useCoaching'

const {
  getAllSlots,
  createSlot,
  deleteSlot,
  updateSlot
} = useCoaching()

const slots = ref([])
const filterDate = ref('')
const createDialog = ref(false)
const editDialog = ref(false)

const form = ref({
  id: null,
  title: '',
  start: '',
  end: '',
  duration: 60,
  slotClass: 'available'
})

onMounted(async () => {
  await loadSlots()
})

async function loadSlots() {
  slots.value = await getAllSlots()
}

function format(dateStr) {
  return new Date(dateStr).toLocaleString('de-DE')
}

const filteredSlots = computed(() => {
  if (!filterDate.value) return slots.value
  return slots.value.filter(s => s.start.startsWith(filterDate.value))
})

function openCreateDialog() {
  form.value = { title: '', start: '', duration: 60 }
  createDialog.value = true
}

async function saveNewSlot() {
  const startDate = new Date(form.value.start)
  const endDate = new Date(startDate.getTime() + form.value.duration * 60000)

  await createSlot({
    title: form.value.title,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    duration: form.value.duration,
    slotClass: 'available'
  })

  createDialog.value = false
  await loadSlots()
}

function openEditDialog(slot) {
  form.value = {
    id: slot._id,
    title: slot.title,
    start: slot.start,
    end: slot.end,
    slotClass: slot.slotClass
  }
  editDialog.value = true
}

async function saveEditSlot() {
  await updateSlot(form.value.id, {
    title: form.value.title,
    start: form.value.start,
    end: form.value.end,
    slotClass: form.value.slotClass
  })

  editDialog.value = false
  await loadSlots()
}

async function deleteSlotConfirm(slot) {
  if (confirm('Biztosan törlöd ezt az időpontot?')) {
    await deleteSlot(slot._id)
    await loadSlots()
  }
}
</script>
