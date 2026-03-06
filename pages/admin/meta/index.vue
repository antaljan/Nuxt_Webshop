<template>
  <v-container>
    <h1 class="text-h4 mb-6">Social Automation Dashboard</h1>

    <v-row>
      <v-col cols="12" md="4">
        <v-card theme="dark" color="purple-darken-2" class="pa-4 text-center">
          <v-icon size="large" class="mb-2">mdi-instagram</v-icon>
          <div class="text-h6">Összes interakció</div>
          <div class="text-h3 font-weight-bold">{{ stats.totalInteractions || 0 }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card theme="dark" color="green-darken-2" class="pa-4 text-center">
          <v-icon size="large" class="mb-2">mdi-email-send</v-icon>
          <div class="text-h6">Kiküldött DM-ek</div>
          <div class="text-h3 font-weight-bold">{{ stats.sentDMs || 0 }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-8">
      <v-card-title>Legutóbbi Instagram kommentek</v-card-title>
      <v-table>
        <thead>
          <tr>
            <th>Időpont</th>
            <th>Felhasználó</th>
            <th>Komment szövege</th>
            <th>Státusz</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log._id">
            <td>{{ new Date(log.timestamp).toLocaleString('hu-HU') }}</td>
            <td><strong>@{{ log.userName }}</strong></td>
            <td>{{ log.text }}</td>
            <td>
              <v-chip v-if="log.isConversion" color="success" size="small">DM Elküldve</v-chip>
              <v-chip v-else color="grey" size="small">Csak olvasva</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })
const stats = ref({})
const logs = ref([])

const loadStats = async () => {
  try {
    const data = await $fetch('/api/meta/stats')
    stats.value = data.summary
    logs.value = data.recentLogs
  } catch (e) {
    console.error("Meta stats error", e)
  }
}

onMounted(loadStats)
</script>