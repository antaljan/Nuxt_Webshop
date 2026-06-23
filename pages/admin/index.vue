<template>
  <v-container fluid class="bg-gray-50 min-h-screen p-6">

    <!-- WELCOME -->
    <h1 class="text-h4 font-weight-bold mb-6 text-blue-darken-4">
      Üdvözöllek, {{ user?.name || 'Admin' }}! 👋
    </h1>

    <!-- KPI CARDS -->
    <v-row class="mb-8">

      <!-- Revenue -->
      <v-col cols="12" sm="6" md="2">
        <v-card border elevation="1" class="p-6 text-center rounded-xl cursor-pointer" to="/admin/purchases">
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

      <!-- Bookings -->
      <v-col cols="12" sm="6" md="2">
        <v-card border elevation="1" class="p-6 text-center rounded-xl cursor-pointer" to="/admin/coaching">
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

      <!-- Subscribers -->
      <v-col cols="12" sm="6" md="2">
        <v-card border elevation="1" class="p-6 text-center rounded-xl cursor-pointer" to="/admin/newsletter/subscribers">
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

      <!-- Users -->
      <v-col cols="12" sm="6" md="2">
        <v-card border elevation="1" class="p-6 text-center rounded-xl cursor-pointer" to="/admin/users">
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

      <!-- Page views -->
      <v-col cols="12" sm="6" md="2">
        <v-card border elevation="1" class="p-6 text-center rounded-xl cursor-pointer" to="/admin/cibersecu">
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

    <!-- SALES + UPCOMING SESSIONS -->
    <v-row class="mb-10">
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
              <template #prepend>
                <v-avatar color="blue-lighten-5" size="small">
                  <v-icon size="small" color="blue">mdi-account</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="text-body-2 font-weight-bold">
                {{ session.userName }}
              </v-list-item-title>

              <template #append>
                <v-btn
                  v-if="isAdminLinkActive(session.start)"
                  icon="mdi-video"
                  variant="text"
                  color="success"
                  size="small"
                  :to="`/user/coaching/${session._id}`"
                />
                <v-icon v-else size="x-small" color="grey-lighten-1">mdi-clock-outline</v-icon>
              </template>
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

    <!-- ADMIN TOOLS GRID -->
    <h2 class="text-h5 font-weight-bold mb-4">Admin eszközök</h2>

    <v-row>
      <v-col
        v-for="tool in adminTools"
        :key="tool.to"
        cols="12" sm="6" md="3"
      >
        <v-card
          border
          elevation="1"
          class="rounded-xl p-4 cursor-pointer h-full"
          :to="tool.to"
        >
          <div class="d-flex align-center gap-4">
            <v-avatar size="40" :color="tool.color + '-lighten-4'">
              <v-icon :color="tool.color + '-darken-2'">{{ tool.icon }}</v-icon>
            </v-avatar>
            <div class="font-weight-medium text-body-1">
              {{ tool.label }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
const { user } = useAuth()
const { data: summary } = await useFetch('/api/dashboard/summary')
const { data: users } = await useFetch('/api/admin/users')

/* UPCOMING SESSIONS */
const upcomingSessions = computed(() => summary.value?.upcomingSessions || [])

/* SALES CHART */
const salesData = computed(() => {
  if (!summary.value?.salesHistory) return null
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

/* TIME FORMATTER */
const formatSessionTime = (date) =>
  new Date(date).toLocaleString('hu-HU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

function isAdminLinkActive(startTime) {
  const now = Date.now()
  const start = new Date(startTime).getTime()
  return now >= start - 15 * 60 * 1000
}

/* ADMIN TOOLS GRID */
const adminTools = [
  {
    to: '/admin/blog',
    label: 'Blog bejegyzések',
    icon: 'mdi-post-outline',
    color: 'blue'
  },
  {
    to: '/admin/newsletter',
    label: 'Hírlevelek',
    icon: 'mdi-email-edit',
    color: 'purple'
  },
  {
    to: '/admin/products',
    label: 'Termékek',
    icon: 'mdi-shopping',
    color: 'green'
  },
  {
    to: '/admin/freebies',
    label: 'Freebie',
    icon: 'mdi-gift',
    color: 'pink'
  },
  {
    to: '/admin/leadmagnet',
    label: 'Leadmagnet oldalak',
    icon: 'mdi-bullhorn',
    color: 'orange'
  },
  {
    to: '/admin/coaching',
    label: 'Coaching ülések',
    icon: 'mdi-calendar-check',
    color: 'blue'
  },
  {
    to: '/admin/questionnaire',
    label: 'Kérdőívek',
    icon: 'mdi-file-document-edit',
    color: 'indigo'
  },
  {
    to: '/admin/brand',
    label: 'Brand beállítások',
    icon: 'mdi-palette',
    color: 'cyan'
  },
  {
    to: '/admin/meta',
    label: 'Meta DM modul',
    icon: 'mdi-facebook-messenger',
    color: 'deep-purple'
  },
  {
    to: '/admin/images',
    label: 'Képek kezelése',
    icon: 'mdi-image-multiple',
    color: 'teal'
  },
  {
    to: '/admin/cibersecu',
    label: 'Kiberbiztonság',
    icon: 'mdi-shield-lock',
    color: 'red'
  }
]

</script>
