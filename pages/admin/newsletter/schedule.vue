<template>
  <section class="p-6 bg-gray-50 min-h-screen">
    <v-container>
      <v-card class="rounded-xl shadow-lg mx-auto" max-width="800">
        <v-toolbar color="blue-darken-3" flat>
          <v-btn icon="mdi-arrow-left" to="/admin/newsletter" variant="text"></v-btn>
          <v-toolbar-title>Hírlevél időzítése</v-toolbar-title>
        </v-toolbar>

        <v-card-text class="p-8">
          <v-form v-model="isValid">
            <!-- 1. Tárgymező -->
            <v-text-field
              v-model="subject"
              label="E-mail tárgya"
              variant="outlined"
              prepend-inner-icon="mdi-format-title"
              :rules="[v => !!v || 'Tárgy kötelező']"
              class="mb-4"
            />

            <!-- 2. Sablon választó -->
            <v-select
              v-model="templateId"
              :items="templates"
              item-title="subject"
              item-value="_id"
              label="Válassz egy mentett sablont"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
              :rules="[v => !!v || 'Sablon választása kötelező']"
              class="mb-4"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="formatDate(item.raw.createdAt)"></v-list-item>
              </template>
            </v-select>

            <v-row>
              <!-- 3. Dátum választó -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="sendDate"
                  type="date"
                  label="Küldés napja"
                  variant="outlined"
                  prepend-inner-icon="mdi-calendar"
                />
              </v-col>
              <!-- 4. Idő választó -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="sendTime"
                  type="time"
                  label="Időpont"
                  variant="outlined"
                  prepend-inner-icon="mdi-clock-outline"
                />
              </v-col>
            </v-row>

            <v-alert
              v-if="sendDate"
              type="info"
              variant="tonal"
              density="compact"
              class="mt-4"
            >
              A hírlevél a megadott időpont utáni legközelebbi óránkénti futáskor (Cron) kerül kiküldésre.
            </v-alert>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="p-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" to="/admin/newsletter">Mégse</v-btn>
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            :disabled="!isValid || !subject || !templateId"
            :loading="loading"
            @click="handleSchedule"
          >
            Időzítés mentése
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </section>
</template>

<script setup>
// Composables importálása
const { fetchTemplates, fetchSubscribers } = useNewsletter()
const router = useRouter()

// Reaktív állapotok (külön ref-ek a stabilitásért)
const isValid = ref(false)
const loading = ref(false)
const templates = ref([])

// Mezők alapértelmezett értékei
const subject = ref('')
const templateId = ref(null)
const sendDate = ref(new Date().toISOString().split('T')[0])
const sendTime = ref('08:00')

// Sablonok betöltése induláskor
onMounted(async () => {
  try {
    const res = await fetchTemplates()
    templates.value = res.allNewsletters || []
  } catch (err) {
    console.error("Hiba a sablonok betöltésekor:", err)
  }
})

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : ''

async function handleSchedule() {
  if (!subject.value || !templateId.value) {
    alert("Kérlek tölts ki minden mezőt!");
    return;
  }

  loading.value = true
  try {
    // Dátum és idő összefűzése ISO formátumba
    const scheduledDateTime = new Date(`${sendDate.value}T${sendTime.value}`).toISOString()
    
    // Feliratkozók lekérése (hogy rögzítsük a listát a mentés pillanatában)
    const subRes = await fetchSubscribers()
    const subscriberList = subRes.subscribers || subRes

    // Payload összeállítása az Express backendnek
    const payload = {
      subject: subject.value,
      templateId: templateId.value,
      subscribers: subscriberList,
      sendDate: scheduledDateTime,
      sent: false
    }

    // Küldés a Nuxt szerveroldali proxyn keresztül
    await $fetch('/api/newsletter/schedule', {
      method: 'POST',
      body: payload
    })

    alert("✅ Hírlevél sikeresen ütemezve!")
    router.push('/admin/newsletter')

  } catch (err) {
    console.error("Időzítési hiba:", err)
    alert("❌ Hiba történt: " + (err.data?.message || "Bad Request"))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.p-8 { padding: 2rem; }
.p-6 { padding: 1.5rem; }
</style>
