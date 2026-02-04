<template>
  <section class="p-6">
    <v-card class="mx-auto shadow-lg rounded-xl overflow-hidden mb-6">
      <!-- HEADER & VIZUÁLIS STATS -->
      <div class="bg-blue-darken-4 p-6 text-white">
        <v-row align="center">
          <v-col cols="12" md="4">
            <h2 class="text-2xl font-bold mb-4">{{ $t('admin.newsletter.title') }}</h2>
            <v-row dense>
              <v-col v-for="(val, key) in statsMap" :key="key" cols="6">
                <div class="bg-white/10 p-3 rounded-lg border border-white/10">
                  <div class="text-xs uppercase opacity-70">{{ $t(`admin.newsletter.stats.${key}`) }}</div>
                  <div class="text-2xl font-black">{{ val }}</div>
                </div>
              </v-col>
            </v-row>
          </v-col>
          
          <!-- ÚJ: Kampány összehasonlító grafikon -->
          <v-col cols="12" md="8">
            <v-card theme="dark" variant="flat" class="bg-white/5 pa-4 rounded-lg h-full">
              <div class="text-subtitle-2 mb-2 opacity-70 text-center uppercase">Utolsó 5 kampány teljesítménye (%)</div>
              <div class="h-[200px]">
                 <ChartsBarChart 
                   v-if="chartData" 
                   :chart-data="chartData" 
                   :options="chartOptions" 
                 />
              </div>
            </v-card>
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
  async () => {
    const res = await fetchCampaigns();
    // Ha a res egy tömb, akkor transzformáljuk, hogy legyenek százalékos értékeink
    return res.map(c => ({
      ...c,
      // Backendről jövő adatok alapján számolunk, ha a backend nem küldené a %-ot
      openRate: c.recipients > 0 ? ((c.opens / c.recipients) * 100).toFixed(1) : 0,
      clickRate: c.recipients > 0 ? ((c.clicks / c.recipients) * 100).toFixed(1) : 0,
      sendDate: c.sentAt // A backend sentAt-et küld, a táblázat sendDate-et vár
    }));
  },
  { watch: [showList] }
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

// GRAFIKON LOGIKA
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top', labels: { color: '#fff' } }
  },
  scales: {
    y: { beginAtZero: true, max: 100, ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    x: { ticks: { color: '#fff' }, grid: { display: false } }
  }
}

const chartData = computed(() => {
  if (!campaigns.value || campaigns.value.length === 0) return null

  // Utolsó 5 kampány vétele
  const lastFive = [...campaigns.value]
    .sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate))
    .slice(0, 5)
    .reverse()

  return {
    labels: lastFive.map(c => c.subject.substring(0, 15) + '...'),
    datasets: [
      {
        label: 'Megnyitás %',
        backgroundColor: '#4CAF50',
        data: lastFive.map(c => parseFloat(c.openRate) || 0)
      },
      {
        label: 'Kattintás %',
        backgroundColor: '#2196F3',
        data: lastFive.map(c => parseFloat(c.clickRate) || 0)
      }
    ]
  }
})


function newSubscriber() {
  // Hier könntest du einen Dialog öffnen oder zu einer neuen Seite leiten
  alert("Új feliratkozó hozzáadása funkció hamarosan...");
}

function editSubscriber(item) {
  console.log("Szerkesztés:", item);
  // Logik für den Edit-Dialog
}


</script>
