<template>
  <section class="p-6 space-y-10">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Hírlevél kezelés</h1>
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

      <!-- Number of templates -->
      <v-col cols="12" sm="6" md="2">
      <v-card 
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
        to="/admin/newsletter/create"
      >
        <h3 class="text-lg font-semibold">Hírlevelek</h3>
        <p class="text-3xl font-bold">{{ templateCount }}</p>
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
        <h3 class="text-lg font-semibold">Hírlevél idözítések</h3>
        <p class="text-3xl font-bold">{{ totalCampaigns }}</p>
      </v-card>
      </v-col>

      <!-- newsletter delivery log -->
      <v-col cols="12" sm="6" md="2">
      <v-card
        border
        elevation="1"
        class="p-6 text-center rounded-xl cursor-pointer"
        to="/admin/newsletter/delivery-log"
      >
        <h3 class="text-lg font-semibold">Küldési napló</h3>
        <p class="text-3xl font-bold">{{ stats.totalNewsletters }}</p>
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

  </section>
</template>

<script setup>
import { computed } from 'vue'
import NewsletterMonthlySubscribersChart from '@/components/admin/newsletter/NewsletterMonthlySubscribersChart.vue'

const {
  fetchSummary,
  fetchCampaignStats,
  fetchTemplates,
  fetchMonthlySubscribers,
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

</script>

