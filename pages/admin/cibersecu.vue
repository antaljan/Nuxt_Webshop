<template>
  <v-container fluid>

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
        <v-card height="420" variant="outlined" class="d-flex flex-column">
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
        <v-card title="Gyanús Bot Tevékenység" color="error" theme="dark">
          <v-card-text>
            <div class="text-h2">{{ data?.totals?.suspicious || 0 }}</div>
            <div class="text-subtitle-1">Gyanús kérések</div>
          </v-card-text>
        </v-card>

        <v-card title="Honeypot találatok" class="mt-4" color="warning">
          <v-card-text>
            <div class="text-h2">{{ data?.honeypotHits || 0 }}</div>
            <div class="text-subtitle-1">Csapdába esett botok</div>
          </v-card-text>
        </v-card>

        <v-card title="Ismeretlen országok" class="mt-4" color="warning">
          <v-card-text>
            <div class="text-h2">{{ unknownCountries }}</div>
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
            <div style="height: 450px;">
              <GeoIpMap v-if="geoFiltered" :data="geoFiltered" />
            </div>
          </ClientOnly>
        </v-card>
      </v-col>

      <!-- TOP IPs -->
      <v-col cols="12" md="6">
        <v-card title="Gyanús IP címek listája">
          <v-data-table
            :headers="ipHeaders"
            :items="data?.topIps"
            density="compact"
          ></v-data-table>
        </v-card>
      </v-col>

    </v-row>

  </v-container>
</template>

<script setup>
/* -------------------------
   DATE RANGE STATE
------------------------- */

const today = new Date()
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

const toDate = ref(today.toISOString().substring(0, 10))
const fromDate = ref(sevenDaysAgo.toISOString().substring(0, 10))

/* -------------------------
   FETCH DATA (manual only)
------------------------- */

const data = ref(null)
const loading = ref(false)

async function loadStats() {
  loading.value = true

  const params = {
    from: fromDate.value + "T00:00:00",
    to: toDate.value + "T23:59:59"
  }

  try {
    data.value = await $fetch('/api/logs/stats', { params })
  } finally {
    loading.value = false
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
