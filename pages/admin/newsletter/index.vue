<template>
  <section class="p-6">

    <!-- STATS + GRAPH -->
    <NewsletterStats
      :stats-map="statsMap"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />

    <!-- SWITCHER -->
    <NewsletterSwitcher
      v-model="showList"
    />

    <!-- ACTION BAR -->
    <v-card-actions class="p-4 flex flex-wrap gap-2">
      <template v-if="!showList">
        <v-btn 
          color="primary" 
          variant="elevated" 
          to="/admin/newsletter/schedule" 
          prepend-icon="mdi-clock-send"
        >
          {{ $t('admin.newsletter.sendNow') }}
        </v-btn>

        <v-btn 
          color="secondary" 
          variant="outlined" 
          to="/admin/newsletter/create" 
          prepend-icon="mdi-email-newsletter"
        >
          {{ $t('admin.newsletter.templates') }}
        </v-btn>
      </template>

      <template v-else>
        <v-btn 
          color="success" 
          variant="elevated" 
          @click="openNewSubscriber" 
          prepend-icon="mdi-account-plus"
        >
          {{ $t('admin.newsletter.newSubscriber') }}
        </v-btn>
      </template>
    </v-card-actions>

    <!-- CONTENT -->
    <v-window v-model="showListValue">

      <!-- CAMPAIGNS -->
      <v-window-item :value="0">
        <NewsletterCampaigns
          :campaigns="campaigns || []"
          :loading="pendingCampaigns"
          @preview="openPreview"
        />
      </v-window-item>

      <!-- SUBSCRIBERS -->
      <v-window-item :value="1">
        <NewsletterSubscribers
          :subscribers="subscribers?.subscribers || []"
          :loading="pendingSubscribers"
          @edit="openEditSubscriber"
          @delete="confirmDelete"
        />
      </v-window-item>

    </v-window>

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
import NewsletterStats from '~/components/admin/newsletter/NewsletterStats.vue'
import NewsletterSwitcher from '~/components/admin/newsletter/NewsletterSwitcher.vue'
import NewsletterCampaigns from '~/components/admin/newsletter/NewsletterCampaigns.vue'
import NewsletterSubscribers from '~/components/admin/newsletter/NewsletterSubscribers.vue'
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'
import NewsletterSubscriberDialog from '~/components/admin/newsletter/NewsletterSubscriberDialog.vue'

const { locales } = useI18n()
const { fetchSummary, fetchCampaigns, fetchSubscribers, deleteSubscriber } = useNewsletter()

/* LANGUAGE LIST */
const languages = computed(() =>
  locales.value.map(l => ({
    title: l.code.toUpperCase(),
    value: l.code
  }))
)

/* SWITCHER */
const showList = ref(false)
const showListValue = computed(() => showList.value ? 1 : 0)

/* FETCH DATA */

// SUMMARY
const { data: summary } = await useAsyncData('newsletter-summary', () => fetchSummary())

// CAMPAIGNS – régi, működő transzformáció visszahozva
const { data: campaigns, pending: pendingCampaigns } = await useAsyncData(
  'campaigns',
  async () => {
    const res = await fetchCampaigns()
    return res.map(c => ({
      ...c,
      openRate: c.recipients > 0 ? ((c.opens / c.recipients) * 100).toFixed(1) : 0,
      clickRate: c.recipients > 0 ? ((c.clicks / c.recipients) * 100).toFixed(1) : 0,
      sendDate: c.sentAt
    }))
  },
  { watch: [showList] }
)

// SUBSCRIBERS
const { data: subscribers, pending: pendingSubscribers, refresh: refreshSubscribers } =
  await useAsyncData('subscribers', () => fetchSubscribers())


/* STATS */
const statsMap = computed(() => ({
  totalNewsletters: summary.value?.totalNewsletters || 0,
  totalSubscribers: summary.value?.totalSubscribers || 0,
  totalOpened: summary.value?.totalOpened || 0,
  totalClicks: summary.value?.totalClicks || 0
}))

/* GRAPH OPTIONS */
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true, position: 'top', labels: { color: '#fff' } } },
  scales: {
    y: { beginAtZero: true, max: 100, ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
    x: { ticks: { color: '#fff' }, grid: { display: false } }
  }
}

const chartData = computed(() => {
  if (!campaigns.value?.length) return null
  const lastFive = [...campaigns.value]
    .sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate))
    .slice(0, 5)
    .reverse()

  return {
    labels: lastFive.map(c => c.subject.substring(0, 15) + '...'),
    datasets: [
      { label: 'Megnyitás %', backgroundColor: '#4CAF50', data: lastFive.map(c => parseFloat(c.openRate) || 0) },
      { label: 'Kattintás %', backgroundColor: '#2196F3', data: lastFive.map(c => parseFloat(c.clickRate) || 0) }
    ]
  }
})

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
