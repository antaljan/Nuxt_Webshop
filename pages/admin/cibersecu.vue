<template>
  <v-container fluid>
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
            <template #fallback>
              <div class="d-flex align-center justify-center" style="height: 300px;">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </template>
          </ClientOnly>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card title="Gyanús Bot Tevékenység" color="error" theme="dark">
          <v-card-text>
            <div class="text-h3">{{ data?.security?.botCount || 0 }}</div>
            <div class="text-subtitle-1">Blokkolt kérések (24h)</div>
          </v-card-text>
        </v-card>
        
        <v-card title="Honeypot találatok" class="mt-4" color="warning">
          <v-card-text>
            <div class="text-h3">{{ data?.security?.honeypotHits || 0 }}</div>
            <div class="text-subtitle-1">Csapdába esett botok</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Földrajzi eloszlás -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card title="Top Országok (GeoIP)">
          <v-list density="compact">
            <v-list-item v-for="c in data?.topCountries" :key="c._id">
              <template v-slot:prepend>
                <v-icon color="primary">mdi-flag</v-icon>
              </template>
              <v-list-item-title>{{ c._id || 'Ismeretlen' }}</v-list-item-title>
              <template v-slot:append>{{ c.count }}</template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      
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
const { data } = await useAsyncData('cyber-stats', () => $fetch('/api/logs/stats'), {
  headers: useRequestHeaders(['cookie'])
})

const ipHeaders = [
  { title: 'IP Cím', key: '_id' },
  { title: 'Kérések', key: 'count' }
]

// Adatok előkészítése a Chart.js számára
const chartData = computed(() => {
  if (!data.value?.dailyRequests) return null
  return {
    labels: data.value.dailyRequests.map(d => d._id),
    datasets: [{
      label: 'Napi kérések',
      data: data.value.dailyRequests.map(d => d.count),
      backgroundColor: '#1867C0'
    }]
  }
})
</script>
