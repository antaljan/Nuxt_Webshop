<!-- components/GenericScheduler.vue -->
<template>
  <div class="scheduler-container p-4 bg-background text-text">
    <v-row>
      <!-- BAL OLDAL: NAPTÁR -->
      <v-col cols="12" md="7">
        <v-card elevation="2" class="pa-4">
          <ClientOnly>
            <VCalendarDatePicker
              v-model="selectedDate"
              mode="date"
              :attributes="attributes"
              expanded
              borderless
              :min-date="new Date()"
              @dayclick="handleDayClick"
            />
          </ClientOnly>
        </v-card>
      </v-col>

      <!-- JOBB OLDAL: IDŐPONTOK -->
      <v-col cols="12" md="5">
        <v-card elevation="2" class="pa-4 d-flex flex-column" min-height="450">
          <h3 class="text-h6 mb-4">
            {{ formattedDate }}
          </h3>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

          <div v-if="dailySlots.length > 0" class="flex-grow-1 overflow-y-auto" style="max-height: 400px;">
            <v-list lines="two">
              <v-list-item
                v-for="slot in dailySlots"
                :key="slot._id"
                :disabled="slot.slotClass === 'booked' && slot._id !== existingBooking?.slotId"
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

                <template v-slot:append>
                  <!-- Ha ez az aktuális foglalása, akkor jelezzük -->
                  <v-chip v-if="existingBooking && slot._id === existingBooking.slotId" color="info" size="small">
                    Jelenlegi
                  </v-chip>
                  
                  <v-btn
                    v-else-if="slot.slotClass === 'available'"
                    color="primary"
                    variant="flat"
                    size="small"
                    @click="confirmBooking(slot)"
                  >
                    {{ existingBooking ? 'Átfoglal' : 'Kiválaszt' }}
                  </v-btn>
                  
                  <v-chip v-else size="x-small" color="error" variant="tonal">Foglalt</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </div>
          
          <v-alert v-else-if="!loading" type="info" variant="tonal" icon="mdi-calendar-blank">
            Erre a napra nincs meghirdetve szabad időpont.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- MEGERŐSÍTŐ DIALOG -->
    <v-dialog v-model="bookingDialog" max-width="450">
      <v-card v-if="selectedSlot">
        <v-card-title class="headline">{{ existingBooking ? 'Időpont módosítása' : 'Foglalás megerősítése' }}</v-card-title>
        <v-card-text>
          <p v-if="existingBooking" class="mb-4 text-warning">
            Figyelem: A korábbi időpontod ({{ formatTime(existingBooking.start) }}) törlésre kerül és az új időpont kerül rögzítésre.
          </p>
          Biztosan lefoglalod: <br>
          <strong>{{ formattedDate }} {{ formatTime(selectedSlot.start) }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="bookingDialog = false">Mégse</v-btn>
          <v-btn color="primary" :loading="bookingLoading" @click="executeBooking">
            Megerősítem
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = defineProps({
  productId: { type: String, required: true },
  purchaseId: { type: String, required: true }, // Ez köti a konkrét vásárláshoz
  existingBooking: { type: Object, default: null } // Ha módosítás van, a régi foglalás adatai
})

const emit = defineEmits(['booked'])
const { getAvailableSlots, getSlotsByDate, bookSlot } = useCoaching()
const { user } = useAuth()

const selectedDate = ref(new Date())
const dailySlots = ref([])
const allAvailableSlots = ref([])
const loading = ref(false)
const bookingLoading = ref(false)
const bookingDialog = ref(false)
const selectedSlot = ref(null)

const attributes = computed(() => [
  { highlight: true, dates: selectedDate.value },
  ...allAvailableSlots.value.map(slot => ({
    dot: 'green',
    dates: new Date(slot.start)
  }))
])

const formattedDate = computed(() => selectedDate.value.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' }))
const formatTime = (d) => new Date(d).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })

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
    const dateStr = date.toISOString().split('T')[0]
    dailySlots.value = await getSlotsByDate(dateStr)
  } catch (e) {
    console.error("Hiba a slotok lekérésekor", e)
  } finally {
    loading.value = false
  }
}

function handleDayClick(day) {
  selectedDate.value = day.date
  fetchDailySlots(day.date)
}

function confirmBooking(slot) {
  selectedSlot.value = slot
  bookingDialog.value = true
}

async function executeBooking() {
  if (!user.value?._id) return
  
  bookingLoading.value = true
  try {
    const payload = {
      userId: user.value._id,
      productId: props.productId,
      purchaseId: props.purchaseId, // Küldjük a vásárlás ID-t a backendnek!
      oldBookingId: props.existingBooking?._id // Ha van, a backend tudja, hogy módosítás történik
    }
    
    await bookSlot(selectedSlot.value._id, payload)
    
    bookingDialog.value = false
    emit('booked') // Szólunk a szülőnek, hogy zárja be a modalt és frissítsen
  } catch (e) {
    alert("Hiba történt a foglalás során.")
  } finally {
    bookingLoading.value = false
  }
}
</script>
