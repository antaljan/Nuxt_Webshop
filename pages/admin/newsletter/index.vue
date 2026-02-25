<template>
  <section class="p-6 space-y-10">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Hírlevél/Kampány Dashboard</h1>
    </div>

    <!-- KPI CARDS -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="2">
      <v-card
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
        to="/admin/newsletter/subscribers"
      >
        <h3 class="text-lg font-semibold">Feliratkozók</h3>
        <p class="text-3xl font-bold">{{ stats.totalSubscribers }}</p>
      </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
      <v-card
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
        to="/admin/newsletter/delivery-log"
      >
        <h3 class="text-lg font-semibold">Elküldött hírlevelek</h3>
        <p class="text-3xl font-bold">{{ stats.totalNewsletters }}</p>
      </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
      <v-card
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
      >
        <h3 class="text-lg font-semibold">Megnyitások</h3>
        <p class="text-3xl font-bold">{{ stats.totalOpened }}</p>
      </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
      <v-card
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
      >
        <h3 class="text-lg font-semibold">Kattintások</h3>
        <p class="text-3xl font-bold">{{ stats.totalClicks }}</p>
      </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
      <v-card 
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
        to="/admin/newsletter/campaigns"
      >
        <h3 class="text-lg font-semibold">Kampányok</h3>
        <p class="text-3xl font-bold">{{ totalCampaigns }}</p>
      </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="2">
      <v-card 
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
        to="/admin/newsletter/create"
      >
        <h3 class="text-lg font-semibold">Elérhető sablonok</h3>
        <p class="text-3xl font-bold">{{ templateCount }}</p>
      </v-card>
      </v-col>
    </v-row>

    <!-- PERFORMANCE + STACKED -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <v-card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Hírlevél teljesítmény (utolsó 10)</h2>
        <NewsletterPerformanceChart :stats="campaignStatsArray || []" />
      </v-card>

      <v-card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Megnyitások / kattintások / címzettek</h2>
        <NewsletterStackedChart :stats="campaignStatsArray || []" />
      </v-card>
    </div>

    <!-- TREND + TOP TEMPLATES -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <v-card class="p-6">
        <h2 class="text-xl font-semibold mb-4">6 hónapos trend</h2>
        <NewsletterTrendChart :trend="trend || []" />
      </v-card>

      <v-card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Legjobban teljesítő sablonok</h2>
        <NewsletterTopTemplates :templates="topTemplates || []" />
      </v-card>
    </div>

    <!-- HEATMAP -->
    <v-card class="p-6">
      <h2 class="text-xl font-semibold mb-4">Megnyitások időbeli eloszlása</h2>
      <NewsletterHeatmap :heatmap="heatmap || []" />
    </v-card>

  </section>
</template>

<script setup>
import NewsletterPerformanceChart from '~/components/admin/newsletter/NewsletterPerformanceChart.vue'
import NewsletterStackedChart from '~/components/admin/newsletter/NewsletterStackedChart.vue'
import NewsletterTrendChart from '~/components/admin/newsletter/NewsletterTrendChart.vue'
import NewsletterTopTemplates from '~/components/admin/newsletter/NewsletterTopTemplates.vue'
import NewsletterHeatmap from '~/components/admin/newsletter/NewsletterHeatmap.vue'

const { fetchSummary, fetchCampaignStats, fetchTrend, fetchTopTemplates, fetchHeatmap, fetchTemplates } = useNewsletter()

/* SUMMARY */
const { data: summary } = await useAsyncData(
  'newsletter-summary',
  () => fetchSummary()
)

/* CAMPAIGN PERFORMANCE (utolsó 10) */
const { data: campaignStats } = await useAsyncData(
  'newsletter-campaign-stats',
  () => fetchCampaignStats()
)

const totalCampaigns = computed(() => campaignStats.value?.totalCampaigns || 0)
const campaignStatsArray = computed(() => campaignStats.value?.stats || [])

/* TREND (6 hónap) */
const { data: trend } = await useAsyncData(
  'newsletter-trend',
  () => fetchTrend()
)

/* TOP TEMPLATES */
const { data: topTemplates } = await useAsyncData(
  'newsletter-top-templates',
  () => fetchTopTemplates()
)

/* HEATMAP */
const { data: heatmap } = await useAsyncData(
  'newsletter-heatmap',
  () => fetchHeatmap()
)

/* TEMPLATE COUNT */
const { data: templates } = await useAsyncData(
  'newsletter-templates',
  () => fetchTemplates()
)

const templateCount = computed(() => templates.value?.allNewsletters?.length || 0)

/* KPI MAP */
const stats = computed(() => ({
  totalSubscribers: summary.value?.totalSubscribers || 0,
  totalNewsletters: summary.value?.totalNewsletters || 0,
  totalOpened: summary.value?.totalOpened || 0,
  totalClicks: summary.value?.totalClicks || 0
}))
</script>
