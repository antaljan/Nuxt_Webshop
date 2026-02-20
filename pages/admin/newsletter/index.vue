<template>
  <section class="p-6 space-y-8">

    <!-- DASHBOARD HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Hírlevél Dashboard</h1>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        to="/admin/newsletter/campaigns/create"
      >
        Új kampány
      </v-btn>
    </div>

    <!-- TOP STATS -->
    <NewsletterStats :stats-map="statsMap" />

    <!-- QUICK ACTIONS -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

      <v-card class="p-4 hover:shadow-lg cursor-pointer" to="/admin/newsletter/subscribers">
        <h3 class="text-lg font-semibold">Feliratkozók</h3>
        <p class="text-2xl font-bold">{{ statsMap.totalSubscribers }}</p>
      </v-card>

      <v-card class="p-4 hover:shadow-lg cursor-pointer" to="/admin/newsletter/campaigns">
        <h3 class="text-lg font-semibold">Kampányok</h3>
        <p class="text-2xl font-bold">{{ campaigns?.length || 0 }}</p>
      </v-card>

      <v-card class="p-4 hover:shadow-lg cursor-pointer" to="/admin/newsletter/create">
        <h3 class="text-lg font-semibold">Sablonok</h3>
        <p class="text-2xl font-bold">{{ summary?.totalNewsletters || 0 }}</p>
      </v-card>

      <v-card class="p-4 hover:shadow-lg cursor-pointer" to="/admin/newsletter/delivery-log">
        <h3 class="text-lg font-semibold">Kézbesítési napló</h3>
        <p class="text-2xl font-bold">Megnyitások: {{ statsMap.totalOpened }}</p>
      </v-card>

    </div>

    <!-- CAMPAIGN OVERVIEW -->
    <v-card class="p-4">
      <h2 class="text-xl font-semibold mb-4">Aktív kampányok</h2>

      <NewsletterCampaigns
        :campaigns="campaigns || []"
        :loading="pendingCampaigns"
        @preview="openPreview"
      />
    </v-card>

    <!-- RECENT SUBSCRIBERS -->
    <v-card class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Legutóbbi feliratkozók</h2>

        <v-btn
          color="success"
          prepend-icon="mdi-account-plus"
          @click="openNewSubscriber"
        >
          Új feliratkozó
        </v-btn>
      </div>

      <NewsletterSubscribers
        :subscribers="subscribers?.subscribers?.slice(0, 5) || []"
        :loading="pendingSubscribers"
        @edit="openEditSubscriber"
        @delete="confirmDelete"
      />
    </v-card>

    <!-- PREVIEW DIALOG -->
    <NewsletterPreviewDialog
      v-model="previewDialog"
      :campaign="selectedCampaign"
      :template="selectedTemplate"
    />

    <!-- SUBSCRIBER EDIT DIALOG -->
    <NewsletterSubscriberDialog
      v-model="editDialog"
      :is-edit="isEditMode"
      :subscriber="editingSubscriber"
      :languages="languages"
      @save="saveSubscriber"
    />

  </section>
</template>

<script setup>
/* IMPORTS */
import NewsletterStats from '~/components/admin/newsletter/NewsletterStats.vue'
import NewsletterCampaigns from '~/components/admin/newsletter/NewsletterCampaigns.vue'
import NewsletterSubscribers from '~/components/admin/newsletter/NewsletterSubscribers.vue'
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'
import NewsletterSubscriberDialog from '~/components/admin/newsletter/NewsletterSubscriberDialog.vue'

const { locales } = useI18n()
const { fetchSummary, fetchCampaigns, fetchSubscribers, deleteSubscriber } = useNewsletter()

/* LANGUAGES */
const languages = computed(() =>
  locales.value.map(l => ({ title: l.code.toUpperCase(), value: l.code }))
)

/* FETCH SUMMARY */
const { data: summary } = await useAsyncData('newsletter-summary', () => fetchSummary())

/* FETCH CAMPAIGNS */
const { data: campaigns, pending: pendingCampaigns } = await useAsyncData(
  'campaigns',
  () => fetchCampaigns()
)

/* FETCH SUBSCRIBERS */
const { data: subscribers, pending: pendingSubscribers, refresh: refreshSubscribers } =
  await useAsyncData('subscribers', () => fetchSubscribers())

/* STATS MAP */
const statsMap = computed(() => ({
  totalNewsletters: summary.value?.totalNewsletters || 0,
  totalSubscribers: summary.value?.totalSubscribers || 0,
  totalOpened: summary.value?.totalOpened || 0,
  totalClicks: summary.value?.totalClicks || 0
}))

/* PREVIEW LOGIC */
const previewDialog = ref(false)
const selectedCampaign = ref({})
const selectedTemplate = ref({})

async function openPreview(item) {
  selectedCampaign.value = item

  const raw = await $fetch('/api/newsletter/getscheduled', { method: 'POST' })
  const match = raw.scheduledNewsletters.find(c => c.subject === item.subject)

  if (!match) return alert('Nem található sablon')

  const res = await $fetch('/api/newsletter/getonetemplate', {
    method: 'POST',
    body: { _id: match.templateId }
  })

  selectedTemplate.value = res.oneNewsletter
  previewDialog.value = true
}

/* SUBSCRIBER CRUD */
const editDialog = ref(false)
const isEditMode = ref(false)
const editingSubscriber = ref({})

function openNewSubscriber() {
  isEditMode.value = false
  editingSubscriber.value = { firstname: '', name: '', email: '', group: 'ujjonc', language: 'hu' }
  editDialog.value = true
}

function openEditSubscriber(item) {
  isEditMode.value = true
  editingSubscriber.value = { ...item }
  editDialog.value = true
}

async function saveSubscriber(subscriber) {
  const url = isEditMode.value ? '/api/newsletter/subscriber' : '/api/newsletter/subscribe'
  const method = isEditMode.value ? 'PUT' : 'POST'

  await $fetch(url, { method, body: subscriber })
  editDialog.value = false
  await refreshSubscribers()
}

async function confirmDelete(item) {
  if (confirm('Biztosan törlöd?')) {
    await deleteSubscriber(item.email)
    await refreshSubscribers()
  }
}
</script>
