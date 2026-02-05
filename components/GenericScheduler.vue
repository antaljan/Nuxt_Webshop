<!-- components/GenericScheduler.vue -->
<template>
  <div class="scheduler-container p-4">
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="2" class="pa-4">
          <ClientOnly>
            <VCalendarDatePicker
              v-model="selectedDate"
              mode="date"
              :attributes="attributes"
              expanded
              borderless
              @dayclick="handleDayClick"
            />
          </ClientOnly>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Időpontok listája az adott napra -->
        <v-card elevation="2" class="pa-4" min-height="400">
          <h3 class="text-h6 mb-4">
            {{ formattedDate }} - Időpontok
          </h3>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

          <div v-if="dailySlots.length > 0">
            <v-list lines="two">
              <v-list-item
                v-for="slot in dailySlots"
                :key="slot._id"
                :disabled="slot.slotClass === 'booked'"
                border
                class="mb-2 rounded"
              >
                <template v-slot:prepend>
                  <v-icon :color="slot.slotClass === 'available' ? 'green' : 'grey'">
                    mdi-clock-outline
                  </v-icon>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ formatTime(slot.start) }} - {{ formatTime(slot.end) }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  {{ slot.title }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    v-if="slot.slotClass === 'available'"
                    color="primary"
                    variant="tonal"
                    size="small"
                    @click="confirmBooking(slot)"
                  >
                    Foglalás
                  </v-btn>
                  <v-chip v-else size="x-small" color="error">Foglalt</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>
          
          <v-alert v-else-if="!loading" type="info" variant="tonal">
            Nincs elérhető időpont erre a napra.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Foglalás megerősítése Dialog -->
    <v-dialog v-model="bookingDialog" max-width="400">
      <v-card v-if="selectedSlot">
        <v-card-title>Foglalás megerősítése</v-card-title>
        <v-card-text>
          Biztosan lefoglalod az alábbi időpontot? <br>
          <strong>{{ formattedDate }} {{ formatTime(selectedSlot.start) }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="bookingDialog = false">Mégse</v-btn>
          <v-btn color="primary" :loading="bookingLoading" @click="executeBooking">
            Igen, foglalom
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCoaching } from '~/composables/useCoaching'
import { useAuth } from '~/composables/useAuth'
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const components = { VCalendarDatePicker }
const { getAvailableSlots, getSlotsByDate, bookSlot } = useCoaching()
const { user } = useAuth()
const selectedDate = ref(new Date())
const dailySlots = ref([])
const allAvailableSlots = ref([])
const loading = ref(false)
const bookingLoading = ref(false)
const bookingDialog = ref(false)
const selectedSlot = ref(null)
const props = defineProps({
  productId: { type: String, required: true }
})

// calender visuel marks (dots on days wich is available)
const attributes = computed(() => [
  {
    highlight: true,
    dates: selectedDate.value,
  },
  ...allAvailableSlots.value.map(slot => ({
    dot: 'green',
    dates: new Date(slot.start),
    popover: { label: slot.title }
  }))
])

// Date formating
const formattedDate = computed(() => {
  return selectedDate.value.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })
})

// Time formating
const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })
}

// Load initial data
onMounted(async () => {
  await fetchAllAvailable()
  await fetchDailySlots(selectedDate.value)
})
async function fetchAllAvailable() {
  const data = await getAvailableSlots()
  allAvailableSlots.value = data || []
}
async function fetchDailySlots(date) {
  if (!date) return
  loading.value = true
  try {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    dailySlots.value = await getSlotsByDate(dateStr)
  } catch (e) {
    console.error("Hiba a slotok lekérésekor", e)
  } finally {
    loading.value = false
  }
}

// filter for days
function handleDayClick(day) {
  selectedDate.value = day.date
  fetchDailySlots(day.date)
}

// booking comfirmation
function confirmBooking(slot) {
  selectedSlot.value = slot
  bookingDialog.value = true
}

// booking
async function executeBooking() {
  if (!selectedSlot.value || !user.value?._id) {
    alert("A foglaláshoz be kell jelentkezned!")
    return
  }
  bookingLoading.value = true
  try {
    const payload = {
      userId: user.value._id,
      productId: props.productId
    }
    await bookSlot(selectedSlot.value._id, payload)
    bookingDialog.value = false
    await fetchDailySlots(selectedDate.value)
    await fetchAllAvailable()
    // emit('booked') // Ellenőrizd, hogy a defineEmits(['booked']) kint van-e a script setup-ban!
  } catch (e) {
    console.error("Foglalási hiba:", e)
    alert("Hiba történt a foglalás során.")
  } finally {
    bookingLoading.value = false
  }
}</script>

<style scoped>
.scheduler-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
