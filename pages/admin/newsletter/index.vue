<template>
  <section class="p-6 space-y-10">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Hírlevél/Kampány Dashboard</h1>
    </div>

    <!-- KPI CARDS -->
    <v-row class="mb-6">

      <!-- Number of subscribers -->
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

      <!-- Number of newsletters -->
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

      <!-- Number of campaigns -->
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

      <!-- Number of templates -->
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

    <!-- MONTHLY SUBSCRIBERS -->
    <v-card class="p-6" style="height: 350px;">
      <h2 class="text-xl font-semibold mb-4">Havi feliratkozók</h2>
      <div class="h-[250px]">
        <NewsletterMonthlySubscribersChart :data="monthlySubscribers" />
      </div>
    </v-card>

    <!-- SENDING CAPACITY -->
    <v-card class="p-6" style="height: 350px;">
      <h2 class="text-xl font-semibold mb-4">Küldési kapacitás</h2>
      <div class="h-[250px]">
        <NewsletterSendingCapacityChart :data="sendingCapacity" />
      </div>
    </v-card>

    <!-- CAMPAIGN PARETO -->
    <v-card class="p-6" style="height: 350px;">
      <h2 class="text-xl font-semibold mb-4">Kampányok teljesítménye (Pareto)</h2>
      <div class="h-[250px]">
        <NewsletterParetoChart :data="campaignPareto" />
      </div>
    </v-card>

    <!-- DEEP DRILL CTA -->
    <v-card class="p-6 text-center">
      <v-btn color="primary" to="/admin/newsletter/campaigns">
        Kampányok részletes elemzése
      </v-btn>
    </v-card>

  </section>
</template>

<script setup>
import { computed } from 'vue'
import NewsletterMonthlySubscribersChart from '@/components/admin/newsletter/NewsletterMonthlySubscribersChart.vue'
import NewsletterSendingCapacityChart from '@/components/admin/newsletter/NewsletterSendingCapacityChart.vue'
import NewsletterParetoChart from '@/components/admin/newsletter/NewsletterCampaignParetoChart.vue'

const {
  fetchSummary,
  fetchCampaignStats,
  fetchTemplates,
  fetchMonthlySubscribers,
  fetchSendingCapacity,
  fetchCampaignPareto
} = useNewsletter()

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

/* TEMPLATE COUNT */
const { data: templates } = await useAsyncData(
  'newsletter-templates',
  () => fetchTemplates()
)
const templateCount = computed(() => templates.value?.allNewsletters?.length || 0)

/* KPI MAP */
const stats = computed(() => ({
  totalSubscribers: summary.value?.totalSubscribers || 0,
  totalNewsletters: summary.value?.totalNewsletters || 0
}))

/* MONTHLY SUBSCRIBERS */
const { data: monthlySubscribersRaw } = await useAsyncData(
  'newsletter-monthly-subscribers',
  () => fetchMonthlySubscribers()
)
const monthlySubscribers = computed(() => monthlySubscribersRaw.value || [])

/* SENDING CAPACITY */
const { data: sendingCapacityRaw } = await useAsyncData(
  'newsletter-sending-capacity',
  () => fetchSendingCapacity()
)
const sendingCapacity = computed(() => sendingCapacityRaw.value || [])

/* CAMPAIGN PARETO */
const { data: campaignParetoRaw } = await useAsyncData(
  'newsletter-campaign-pareto',
  () => fetchCampaignPareto()
)
const campaignPareto = computed(() => campaignParetoRaw.value || [])
</script>

