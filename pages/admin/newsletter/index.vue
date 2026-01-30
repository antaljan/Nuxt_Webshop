<template>
  <section class="p-6">
    <v-card class="mx-auto shadow-lg rounded-xl overflow-hidden">
      <!-- HEADER & STATS -->
      <div class="bg-blue-darken-3 p-6 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">{{ $t('admin.newsletter.title') }}</h2>
        
        <v-row dense class="mt-4">
          <v-col v-for="(val, key) in statsMap" :key="key" cols="6" md="3">
            <div class="bg-white/10 p-3 rounded-lg">
              <div class="text-xs uppercase opacity-70">{{ $t(`admin.newsletter.stats.${key}`) }}</div>
              <div class="text-xl font-bold">{{ val }}</div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- SWITCH FOR LIST TOGGLE -->
      <div class="flex justify-center items-center py-4 bg-gray-50 border-b">
        <span :class="!showList ? 'font-bold text-blue-600' : 'text-gray-400'">{{ $t('admin.newsletter.campaigns') }}</span>
        <v-switch
          v-model="showList"
          inset
          color="primary"
          hide-details
          class="mx-4"
        />
        <span :class="showList ? 'font-bold text-blue-600' : 'text-gray-400'">{{ $t('admin.newsletter.subscribers') }}</span>
      </div>

      <!-- ACTIONS BAR -->
      <v-card-actions class="p-4 flex flex-wrap gap-2">
        <template v-if="!showList">
          <v-btn 
            color="primary" 
            variant="elevated" 
            to="/admin/newsletter/schedule" 
            prepend-icon="mdi-clock-send"
          >
            {{ $t('admin.newsletter.sendNow') }}
          </v-btn>
          <v-btn color="secondary" variant="outlined" to="/admin/newsletter/create" prepend-icon="mdi-email-newsletter">
            {{ $t('admin.newsletter.templates') }}
          </v-btn>
        </template>
        <template v-else>
          <v-btn color="success" variant="elevated" @click="newSubscriber" prepend-icon="mdi-account-plus">
            {{ $t('admin.newsletter.newSubscriber') }}
          </v-btn>
        </template>
      </v-card-actions>

      <!-- DATA TABLES -->
      <v-window v-model="showListValue">
        <!-- CAMPAIGNS TABLE -->
        <v-window-item :value="0">
          <v-data-table
            :headers="campaignHeaders"
            :items="campaigns || []" 
            :loading="pendingCampaigns"
            hover
          >
            <template v-slot:item.subject="{ item }">
              <a href="#" @click.prevent="openPreview(item)" class="text-blue-600 font-medium">
                {{ item.subject }}
              </a>
            </template>
          </v-data-table>
        </v-window-item>

        <!-- SUBSCRIBERS TABLE -->
        <v-window-item :value="1">
          <v-data-table
            :headers="subscriberHeaders"
            :items="subscribers?.subscribers || []"
            :loading="pendingSubscribers"
            hover
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" color="blue" @click="editSubscriber(item)">mdi-pencil</v-icon>
              <v-icon small color="red" @click="confirmDelete(item._id)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-window-item>
      </v-window>
    </v-card>
    
    <!-- dialog for preview the selected newsletter -->
    <v-dialog v-model="previewDialog" max-width="800px">
      <v-card rounded="xl">
        <v-card-title class="bg-blue-darken-3 text-white py-4 px-6">
          {{ selectedCampaign.subject }}
        </v-card-title>
        <v-card-text class="pa-0 bg-white min-h-[400px]">
          <!-- Itt jelenik meg a hírlevél HTML tartalma -->
          <div v-html="selectedTemplate.rawcontent" class="p-4"></div>
        </v-card-text>
        <v-card-actions class="bg-gray-50 pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="tonal" @click="previewDialog = false">
            Bezárás
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </section>
</template>

<script setup>
const { fetchSummary, fetchCampaigns, fetchSubscribers, deleteSubscriber } = useNewsletter()

const showList = ref(false) // false = Hírlevelek, true = Feliratkozók
const showListValue = computed(() => showList.value ? 1 : 0)
const dialog = ref(false)

const sendForm = reactive({
  subject: '',
  date: new Date().toISOString().split('T')[0],
  group: null
})

// Adatok betöltése useAsyncData-val (SSR barát)
const { data: summary } = await useAsyncData('newsletter-summary', () => fetchSummary())
const { data: campaigns, pending: pendingCampaigns } = await useAsyncData(
  'campaigns', 
  () => fetchCampaigns(),
  { 
    // Mivel a dashboard/campaigns direkt tömböt ad vissza:
    transform: (res) => res 
  }
)
const { data: subscribers, pending: pendingSubscribers, refresh: refreshSubscribers } = await useAsyncData('subscribers', () => fetchSubscribers())

const statsMap = computed(() => ({
  totalNewsletters: summary.value?.totalNewsletters || 0,
  totalSubscribers: summary.value?.totalSubscribers || 0,
  totalOpened: summary.value?.totalOpened || 0,
  totalClicks: summary.value?.totalClicks || 0
}))

const campaignHeaders = [
  { title: 'Cím', key: 'subject' },
  { title: 'Dátum', key: 'sendDate' },
  { title: 'Megnyitás (%)', key: 'openRate' },
  { title: 'Kattintás (%)', key: 'clickRate' },
  { title: 'Top Link', key: 'topLink' }
]

const subscriberHeaders = [
  { title: 'Vezetéknév', key: 'name' },
  { title: 'Keresztnév', key: 'firstname' },
  { title: 'Email', key: 'email' },
  { title: 'Műveletek', key: 'actions', sortable: false }
]

async function confirmDelete(id) {
  if (confirm("Biztosan törlöd a feliratkozót?")) {
    await deleteSubscriber(id)
    refreshSubscribers()
  }
}

// Új reaktív változók az előnézethez
const previewDialog = ref(false)
const selectedCampaign = ref({})
const selectedTemplate = ref({})

// 1. Kérjük le a nyers kampányadatokat is (amiben benne van a templateId)
const { data: rawCampaigns } = await useAsyncData('raw-campaigns', () => 
  $fetch('/api/newsletter/getscheduled', { method: 'POST' })
)

async function openPreview(item) {
  selectedCampaign.value = item
  
  // 1. Megkeressük a nyers adatok között a templateId-t a tárgy alapján
  // A rawCampaigns.value.scheduledNewsletters-ben vannak az eredeti objektumok
  const match = rawCampaigns.value?.scheduledNewsletters?.find(
    c => c.subject === item.subject
  )

  if (!match || !match.templateId) {
    console.error('Nem található megfelelő sablon az adott tárgy alapján.')
    alert("Hiba: A kampányhoz tartozó sablon nem azonosítható.")
    return
  }

  // 2. Lekérdezés a Nuxt Proxy-n keresztül
  try {
    const res = await $fetch('/api/newsletter/getonetemplate', {
      method: 'POST',
      body: { _id: match.templateId } // A kikeresett templateId-t küldjük!
    })

    if (res.ok) {
      selectedTemplate.value = res.oneNewsletter
      previewDialog.value = true
    }
  } catch (error) {
    console.error('Hírlevél betöltési hiba:', error)
    alert("Sajnos nem sikerült betölteni a sablont.")
  }
}

function newSubscriber() {
  // Hier könntest du einen Dialog öffnen oder zu einer neuen Seite leiten
  alert("Új feliratkozó hozzáadása funkció hamarosan...");
}

function editSubscriber(item) {
  console.log("Szerkesztés:", item);
  // Logik für den Edit-Dialog
}


</script>
