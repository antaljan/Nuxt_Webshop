<!-- pages/admin/index.vue -->
<template>
  <v-container fluid class="bg-gray-50 min-h-screen p-6">
    <h1 class="text-h4 font-weight-bold mb-6 text-blue-darken-4">
      Üdvözöllek, {{ user?.name || 'Gyöngyi' }}! 👋
    </h1>

    <!-- KPI cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <v-card
          border
          elevation="1"
          class="p-6 text-center rounded-xl cursor-pointer"
          to="/admin/purchases"
        >
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-overline mb-1">Havi bevétel</div>
                <div class="text-h5 font-weight-black text-green-darken-2">
                  {{ summary?.monthlyRevenue?.toLocaleString() }} €
                </div>
              </div>
              <v-avatar color="green-lighten-4" size="large">
                <v-icon color="green-darken-2">mdi-cash-register</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-card
          border
          elevation="1"
          class="p-6 text-center rounded-xl cursor-pointer"
          to="/admin/coaching"
        >
        <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-overline mb-1">Új foglalások</div>
                <div class="text-h5 font-weight-black text-blue-darken-2">
                  {{ summary?.newBookingsCount || 0 }} db
                </div>
              </div>
              <v-avatar color="blue-lighten-4" size="large">
                <v-icon color="blue-darken-2">mdi-calendar-check</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-card
          border
          elevation="1"
          class="p-6 text-center rounded-xl cursor-pointer"
          to="/admin/newsletter/subscribers"
        >
        <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-overline mb-1">Feliratkozók</div>
                <div class="text-h5 font-weight-black text-purple-darken-2">
                  {{ summary?.subscriberCount || 0 }} fő
                </div>
              </div>
              <v-avatar color="purple-lighten-4" size="large">
                <v-icon color="purple-darken-2">mdi-email-multiple</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-card
          border
          elevation="1"
          class="p-6 text-center rounded-xl cursor-pointer"
          to="/admin/users"
        >
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-overline mb-1">Felhasználók</div>
                <div class="text-h5 font-weight-black text-purple-darken-2">
                  {{ users?.length || 0 }} fő
                </div>
              </div>
              <v-avatar color="purple-lighten-4" size="large">
                <v-icon color="purple-darken-2">mdi-account-multiple</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-card
          border
          elevation="1"
          class="p-6 text-center rounded-xl cursor-pointer"
          to="/admin/cibersecu"
        >
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-overline mb-1">Oldalmegtekintés</div>
                <div class="text-h5 font-weight-black text-orange-darken-2">
                  {{ summary?.pageViews || 0 }}
                </div>
              </div>
              <v-avatar color="orange-lighten-4" size="large">
                <v-icon color="orange-darken-2">mdi-eye-outline</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Eladási trendek (Line Chart) -->
      <v-col cols="12" md="8">
        <v-card border elevation="1" class="rounded-xl pa-4 h-full">
          <h3 class="text-h6 mb-4">Eladások alakulása</h3>
          <div class="h-[300px]">
            <ClientOnly>
              <ChartsLineChart v-if="salesData" :chart-data="salesData" />
            </ClientOnly>
          </div>
        </v-card>
      </v-col>

      <!-- Közelgő coaching ülések -->
      <v-col cols="12" md="4">
        <v-card border elevation="1" class="rounded-xl h-full">
          <v-toolbar color="white" border="bottom">
            <v-toolbar-title class="text-subtitle-1 font-weight-bold">
              Közelgő ülések
            </v-toolbar-title>
            <v-spacer />
            <v-btn variant="text" size="small" to="/admin/coaching">Összes</v-btn>
          </v-toolbar>
          <v-list lines="two">
            <v-list-item
              v-for="session in upcomingSessions"
              :key="session._id"
              :subtitle="formatSessionTime(session.start)"
              class="border-b-thin"
            >
              <template v-slot:prepend>
                <v-avatar color="blue-lighten-5" size="small">
                  <v-icon size="small" color="blue">mdi-account</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-bold">
                {{ session.userName || 'Vendég felhasználó' }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="upcomingSessions.length === 0">
              <v-list-item-title class="text-caption text-center opacity-50">
                Nincs közelgő foglalás
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { user } = useAuth()
const { data: summary } = await useFetch('/api/dashboard/summary')
const { data: users } = await useFetch('/api/admin/users')

const upcomingSessions = computed(() => {
  return summary.value?.upcomingSessions || []
})

const salesData = computed(() => {
  if (!summary.value?.salesHistory || !Array.isArray(summary.value.salesHistory)) {
    return null
  }
  return {
    labels: summary.value.salesHistory.map(s => s.month),
    datasets: [{
      label: 'Bevétel (€)',
      borderColor: '#1976D2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      data: summary.value.salesHistory.map(s => s.amount),
      fill: true,
      tension: 0.4
    }]
  }
})

const formatSessionTime = (date) => {
  return new Date(date).toLocaleString('hu-HU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
