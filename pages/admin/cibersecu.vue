<template>
  <v-container fluid>
    
    <!-- BACK BUTTON -->
    <v-btn
      color="primary"
      variant="text"
      prepend-icon="mdi-arrow-left"
      to="/admin"
      class="mb-4"
    >
      Vissza az Admin Dashboardra
    </v-btn>

    <!-- SIMPLE DATE RANGE -->
    <v-card flat class="pa-4 mb-4" color="grey-lighten-4">
      <v-row align="center">

        <!-- FROM -->
        <v-col cols="12" md="3">
          <v-text-field
            label="Dátumtól"
            type="date"
            v-model="fromDate"
            density="compact"
            variant="outlined"
          />
        </v-col>

        <!-- TO -->
        <v-col cols="12" md="3">
          <v-text-field
            label="Dátumig"
            type="date"
            v-model="toDate"
            density="compact"
            variant="outlined"
          />
        </v-col>

      </v-row>
      <v-btn color="primary" @click="loadStats" :loading="loading">
        Frissítés
      </v-btn>
    </v-card>

    <!-- MAIN CHART -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card height="440" variant="outlined" class="d-flex flex-column">
          <v-card-title class="d-flex align-center">
            <v-icon start color="primary">mdi-chart-bar</v-icon>
            Napi API aktivitás
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="flex-grow-1 pa-4">
            <ClientOnly>
              <div style="height: 300px; width: 100%;">
                <ChartsBarChart v-if="chartData" :chart-data="chartData" />
              </div>
            </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- SECURITY CARDS -->
      <v-col cols="12" md="4">
        <!-- GYANÚS BOT TEVÉKENYSÉG KÁRTYA -->
        <v-card title="Gyanús Bot Tevékenység" color="error" theme="dark">
          <v-card-text>
            <div class="text-h4">{{ data?.totals?.suspicious || 0 }}</div>
            <div class="text-subtitle-1">Gyanús kérések</div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" size="small" @click="showAllSuspiciousIps">Összes IP listázása</v-btn>
          </v-card-actions>
        </v-card>

        <!-- HONEYPOT KÁRTYA -->
        <v-card title="Honeypot találatok" class="mt-4" color="warning">
          <v-card-text>
            <div class="text-h4">{{ data?.honeypotHits || 0 }}</div>
            <div class="text-subtitle-1">Csapdába esett botok</div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" size="small" @click="showAllHoneypotDetails">Részletek megtekintése</v-btn>
          </v-card-actions>
        </v-card>

        <!-- IMERETLEN ORSZÁGOK KÁRTYA -->
        <v-card title="Ismeretlen országok" class="mt-4" color="warning">
          <v-card-text>
            <div class="text-h4">{{ unknownCountries }}</div>
            <div class="text-subtitle-1">GeoIP nélkül</div>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

    <!-- GEOIP MAP + TOP IPs -->
    <v-row class="mt-4">

      <!-- GEOIP MAP -->
      <v-col cols="12" md="6">
        <v-card title="Gyanús aktivitás térképe (GeoIP)">
          <ClientOnly>
            <div style="height: 460px;">
              <GeoIpMap v-if="geoFiltered" :data="geoFiltered" />
            </div>
          </ClientOnly>
        </v-card>
      </v-col>

      <!-- TOP IPs -->
      <v-col cols="12" md="6">
        <v-card title="Gyanús IP címek listája">
          <v-data-table :headers="ipHeaders" :items="data?.topIps">
            <template v-slot:item._id="{ item }">
              <v-btn size="small" variant="text" color="primary" @click="showIpDetails(item._id)">
                {{ item._id }}
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- IP RÉSZLETEZŐ MODAL -->
<v-dialog v-model="ipDialog" max-width="800">
  <v-card v-if="selectedIpData">
    <v-card-title class="bg-primary text-white">
      IP Elemzés: {{ selectedIpData.ip }}
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" variant="text" @click="ipDialog = false"></v-btn>
    </v-card-title>
    <v-card-text class="pa-4">
      <v-row>
        <v-col cols="6">
          <strong>Helyszín:</strong> {{ selectedIpData.summary.city }}, {{ selectedIpData.summary.country }}<br>
          <strong>Összes kérés:</strong> {{ selectedIpData.summary.totalRequests }}
        </v-col>
        <v-col cols="6">
          <strong>Státusz:</strong> 
          <v-chip 
            :color="selectedIpData.summary.isBot ? 'error' : 'success'" 
            size="small"
            label
            class="ml-2 text-uppercase"
          >
            <v-icon start size="16">
              {{ selectedIpData.summary.isBot ? 'mdi-robot-dead' : 'mdi-account-check' }}
            </v-icon>
            {{ selectedIpData.summary.isBot ? 'Bot / Tiltott' : 'Valós látogató' }}
          </v-chip>
        </v-col>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <div class="text-subtitle-2 mb-2">Idővonal (Requests)</div>
      <v-list density="compact" height="300" class="overflow-y-auto border">
        <v-list-item 
          v-for="(h, i) in selectedIpData.history" 
          :key="i"
          :class="{ 'bg-red-lighten-5': h.isBot, 'bg-amber-lighten-5': h.isPurchase }"
        >
          <template v-slot:prepend>
            <v-icon :color="h.isBot ? 'error' : 'grey'" size="small">
              {{ h.isBot ? 'mdi-robot-dead' : 'mdi-web' }}
            </v-icon>
          </template>
          <v-list-item-title class="text-caption">
            <!-- Dátum + Idő kijelzése -->
            <strong>{{ new Date(h.timestamp).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</strong>
            - {{ h.method }} {{ h.url }}
            <!-- Vásárlás kiemelése -->
            <v-chip v-if="h.isPurchase" color="amber" size="x-small" class="ml-2">
              💰 SIKERES VÁSÁRLÁS: {{ h.purchaseAmount }} EUR
            </v-chip>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</v-dialog>
<!-- ÖSSZES GYANÚS IP MODAL -->
<v-dialog v-model="allIpsDialog" max-width="900">
  <v-card>
    <v-card-title class="bg-error text-white d-flex align-center">
      Minden gyanús IP ({{ fromDate }} - {{ toDate }})
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" variant="text" @click="allIpsDialog = false"></v-btn>
    </v-card-title>
    <v-data-table
      :headers="allIpHeaders"
      :items="allIpsList"
      :loading="loadingAllIps"
      density="compact"
    >
      <template v-slot:item._id="{ item }">
        <v-btn size="x-small" variant="text" color="primary" @click="showIpDetails(item._id)">
          {{ item._id }}
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</v-dialog>

<!-- HONEYPOT RÉSZLETEK MODAL -->
<v-dialog v-model="honeypotDialog" max-width="1000">
  <v-card>
    <v-card-title class="bg-warning text-black d-flex align-center">
      Honeypot / Tiltott útvonal hívások
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" variant="text" @click="honeypotDialog = false"></v-btn>
    </v-card-title>
    <v-data-table
      :headers="honeypotHeaders"
      :items="honeypotDetails"
      :loading="loadingHoneypot"
      density="compact"
    >
      <template v-slot:item.url="{ item }">
        <code class="text-error font-weight-bold">{{ item.url }}</code>
      </template>
      <template v-slot:item.ip="{ item }">
        <v-btn size="x-small" variant="outlined" color="primary" @click="showIpDetails(item.ip)">
          {{ item.ip }}
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</v-dialog>

  </v-container>
</template>

<script setup>
/* -------------------------
   DATE RANGE STATE
------------------------- */

const today = new Date()
const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)

const toDate = ref(today.toISOString().substring(0, 10))
const fromDate = ref(sevenDaysAgo.toISOString().substring(0, 10))

/* -------------------------
   FETCH DATA (manual only)
------------------------- */

const data = ref(null)
const securityStats = ref(null)
const loading = ref(false)
const ipDialog = ref(false)
const selectedIpData = ref(null)
const loadingDetails = ref(false)

const allIpsDialog = ref(false)
const allIpsList = ref([])
const loadingAllIps = ref(false)

const honeypotDialog = ref(false)
const honeypotDetails = ref([])
const loadingHoneypot = ref(false)

const allIpHeaders = [
  { title: 'IP Cím', key: '_id' },
  { title: 'Kérések', key: 'count' },
  { title: 'Ország', key: 'country' },
  { title: 'Utolsó észlelés', key: 'lastSeen' }
]

const honeypotHeaders = [
  { title: 'Időpont', key: 'timestamp' },
  { title: 'IP Cím', key: 'ip' },
  { title: 'Tiltott útvonal (URL)', key: 'url' },
  { title: 'Módszer', key: 'method' }
]

async function loadStats() {
  loading.value = true
  const params = {
    from: fromDate.value + "T00:00:00",
    to: toDate.value + "T23:59:59"
  }
  try {
    const [stats, sec] = await Promise.all([
      $fetch('/api/logs/stats', { params }),
      $fetch('/api/dashboard/securitystats')
    ])
    data.value = stats
    securityStats.value = sec
  } catch (err) {
    console.error("Hiba a betöltésnél:", err)
  } finally {
    loading.value = false
  }
}

async function showAllSuspiciousIps() {
  allIpsDialog.value = true
  loadingAllIps.value = true
  try {
    allIpsList.value = await $fetch('/api/dashboard/allsuspiciousips', {
      params: { from: fromDate.value, to: toDate.value }
    })
  } finally {
    loadingAllIps.value = false
  }
}

async function showAllHoneypotDetails() {
  honeypotDialog.value = true
  loadingHoneypot.value = true
  try {
    honeypotDetails.value = await $fetch('/api/dashboard/allhoneypothits', {
      params: { from: fromDate.value, to: toDate.value }
    })
  } finally {
    loadingHoneypot.value = false
  }
}

// IP Részletező hívása
async function showIpDetails(ip) {
  ipDialog.value = true
  loadingDetails.value = true
  selectedIpData.value = null
  try {
    selectedIpData.value = await $fetch('/api/dashboard/ipdetails', {
      params: {
        ip: ip,
        from: fromDate.value, // Küldjük a kezdő dátumot
        to: toDate.value      // Küldjük a záró dátumot
      }
    })
  } catch (err) {
    console.error("IP részletek lekérése sikertelen:", err)
  } finally {
    loadingDetails.value = false
  }
}


/* -------------------------
   INITIAL LOAD
------------------------- */

onMounted(() => {
  loadStats()
})

/* -------------------------
   TABLE HEADERS
------------------------- */

const ipHeaders = [
  { title: 'IP Cím', key: '_id' },
  { title: 'Kérések', key: 'count' }
]

const unknownCountries = computed(() => {
  if (!data.value?.geoSuspicious) return 0

  const unknown = data.value.geoSuspicious.find(c => !c._id)
  return unknown?.count || 0
})

/* -------------------------
   CHART DATA
------------------------- */

const chartData = computed(() => {
  if (!data.value?.daily) return null

  return {
    labels: data.value.daily.known.map(d => d._id),
    datasets: [
      {
        label: 'Ismert API hívások',
        data: data.value.daily.known.map(d => d.count),
        backgroundColor: '#1867C0'
      },
      {
        label: 'Gyanús hívások',
        data: data.value.daily.suspicious.map(d => d.count),
        backgroundColor: '#C01818'
      }
    ]
  }
})

const geoFiltered = computed(() => {
  if (!data.value?.geoSuspicious) return null

  return data.value.geoSuspicious.filter(c => {
    const id = (c._id || "").trim()
    return id.length === 2
  })
})

</script>
