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
              :min-date="minDate"
              @dayclick="handleDayClick"
            />
          </ClientOnly>
        </v-card>
      </v-col>

      <!-- JOBB OLDAL: IDŐPONTOK -->
      <v-col cols="12" md="5">
        <v-card elevation="2" class="pa-4 d-flex flex-column" min-height="450">
          <h3 class="text-h6 mb-4">{{ formattedDate }}</h3>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

          <div v-if="dailySlots.length > 0" class="flex-grow-1 overflow-y-auto" style="max-height: 400px;">
            <v-list lines="two">
              <v-list-item
                v-for="slot in dailySlots"
                :key="slot._id"
                border
                class="mb-2 rounded"
              >
                <template #prepend>
                  <v-icon color="green">mdi-clock-outline</v-icon>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ formatTime(slot.start) }} – {{ formatTime(slot.end) }}
                </v-list-item-title>

                <template #append>
                  <!-- Jelenlegi foglalás -->
                  <v-chip
                    v-if="existingBooking && slot._id === existingBooking._id"
                    color="info"
                    size="small"
                  >
                    Jelenlegi
                  </v-chip>

                  <!-- Foglalható / Átfoglalható -->
                  <v-btn
                    v-else
                    color="primary"
                    variant="flat"
                    size="small"
                    @click="confirmBooking(slot)"
                  >
                    {{ existingBooking ? 'Átfoglal' : 'Kiválaszt' }}
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </div>

          <v-alert v-else-if="!loading" type="info" variant="tonal" icon="mdi-calendar-blank">
            Erre a napra nincs meghirdetve időpont.
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- MEGERŐSÍTŐ DIALOG -->
    <v-dialog v-model="bookingDialog" max-width="450">
      <v-card v-if="selectedSlot">
        <v-card-title class="headline">
          {{ existingBooking ? 'Időpont módosítása' : 'Foglalás megerősítése' }}
        </v-card-title>

        <v-card-text>
          <p v-if="existingBooking?.start" class="mb-4 text-warning">
            A korábbi időpontod ({{ formatTime(existingBooking.start) }}) törlésre kerül.
          </p>

          Biztosan lefoglalod?<br>
          <strong>{{ formattedDate }} {{ formatTime(selectedSlot.start) }}</strong>
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
  purchaseId: { type: String, required: true },
  itemId: { type: String, required: true },
  existingBooking: { type: Object, default: null }
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

const minDate = computed(() => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
});

const attributes = computed(() => {
  const now = new Date()
  return [
    { highlight: true, dates: selectedDate.value },
    ...allAvailableSlots.value
      .filter(slot => new Date(slot.start) > now)
      .map(slot => ({
        dot: 'green',
        dates: new Date(slot.start) 
      }))
  ]
})

const formattedDate = computed(() =>
  selectedDate.value.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)

const formatTime = d =>
  new Date(d).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

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
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    
    const slots = await getSlotsByDate(dateStr)
    
    // Frissítsük a 'now'-t minden híváskor
    const now = new Date()

    // Szűrés szigorúbb ellenőrzéssel
    dailySlots.value = slots.filter(slot => {
      const slotStart = new Date(slot.start).getTime();
      const currentTime = now.getTime();
      
      // Csak azokat mutatjuk, amik legalább 10 perccel a jövőben vannak 
      // (hogy legyen ideje befejezni a foglalást)
      return slotStart > (currentTime + 10 * 60 * 1000);
    })
    
    // Debug: Ha még mindig látod a 10 órait, nézd meg a konzolt!
    console.log("Aktuális idő:", now.toISOString());
    console.log("Szűrt slotok száma:", dailySlots.value.length);
    
  } catch (error) {
    console.error("Hiba a slotok betöltésekor:", error);
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
      purchaseId: props.purchaseId,
      itemId: props.itemId,
      oldBookingId: props.existingBooking?._id
    }

    await bookSlot(selectedSlot.value._id, payload)

    bookingDialog.value = false
    emit('booked')
  } finally {
    bookingLoading.value = false
  }
}
</script>
