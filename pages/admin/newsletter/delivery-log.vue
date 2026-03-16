<template>
  <section class="p-6 space-y-8">

    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Kézbesítési napló & Analízis</h1>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-refresh"
        :loading="pending"
        @click="refresh"
      >
        Frissítés
      </v-btn>
    </div>

    <v-btn
      color="primary"
      variant="text"
      prepend-icon="mdi-arrow-left"
      to="/admin/newsletter"
      class="mb-4"
    >
      Vissza a hírlevelekhez
    </v-btn>

    <v-card class="p-4 border rounded-xl shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <v-text-field
          v-model="search"
          label="Keresés (Tárgy / Email)"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />

        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Státusz"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />

        <v-text-field
          v-model="filterDate"
          type="date"
          label="Dátum"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />

        <v-select
          v-model="filterCampaign"
          :items="campaignOptions"
          item-title="name"
          item-value="_id"
          label="Kampány szűrés"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </div>
    </v-card>

    <v-card class="border rounded-xl shadow-sm">
      <v-data-table
        :items="filteredList"
        :headers="headers"
        :loading="pending"
        hover
      >
        <template #item.subject="{ item }">
          <div class="flex flex-col">
            <span class="font-bold text-blue-darken-4">{{ item.subject }}</span>
          </div>
        </template>

        <template #item.campaignId="{ item }">
          <span class="text-caption font-weight-medium">
            {{ getCampaignName(item.campaignId) }}
          </span>
        </template>

        <template #item.sendDate="{ item }">
          {{ new Date(item.sendDate).toLocaleString('hu-HU', { dateStyle: 'short', timeStyle: 'short' }) }}
        </template>

        <template #item.opens="{ item }">
          <div class="d-flex align-center">
            <v-progress-circular
              :model-value="calculateRate(item.opens?.length, item.subscribers?.length)"
              color="green"
              size="24"
              width="3"
              class="mr-2"
            />
            <span>{{ item.opens?.length || 0 }} ({{ calculateRate(item.opens?.length, item.subscribers?.length) }}%)</span>
          </div>
        </template>

        <template #item.clicks="{ item }">
          <span :class="item.clicks?.length > 0 ? 'text-blue-darken-2 font-weight-bold' : 'text-grey'">
            <v-icon size="small" class="mr-1">mdi-cursor-default-click</v-icon>
            {{ item.clicks?.length || 0 }}
          </span>
        </template>

        <template #item.sent="{ item }">
          <v-chip
            :color="item.sent ? 'green-lighten-4' : 'orange-lighten-4'"
            :text-color="item.sent ? 'green-darken-3' : 'orange-darken-3'"
            size="x-small"
            class="font-weight-bold"
          >
            {{ item.sent ? 'KIKÜLDVE' : 'IDŐZÍTVE' }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex">
            <v-tooltip text="Sablon előnézete" location="top">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-eye-outline" variant="text" size="small" color="grey-darken-1" @click="openPreview(item)" />
              </template>
            </v-tooltip>

            <v-tooltip text="Részletes aktivitás (Deep Drill)" location="top">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-account-search-outline" variant="text" size="small" color="primary" @click="openActivity(item)" />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <NewsletterPreviewDialog
      v-model="previewDialog"
      :campaign="selectedItem"
      :template="selectedTemplate"
    />

    <v-dialog v-model="activityDialog" max-width="700px" scrollable>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-between align-center pa-4 bg-grey-lighten-4">
          <div>
            <div class="text-h6 font-weight-bold">Címzettek aktivitása</div>
            <div class="text-caption text-grey-darken-1">{{ selectedItem?.subject }}</div>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="activityDialog = false" />
        </v-card-title>
        
        <v-divider />

        <v-card-text class="pa-0">
          <v-table density="comfortable" fixed-header height="450px">
            <thead>
              <tr class="bg-grey-lighten-5">
                <th>Email cím</th>
                <th class="text-center">Státusz</th>
                <th class="text-center">Utolsó interakció</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in selectedItemActivity" :key="user.email">
                <td class="text-body-2">{{ user.email }}</td>
                <td class="text-center">
                  <v-chip v-if="user.clicked" color="blue" size="x-small" prepend-icon="mdi-cursor-default-click">Kattintott</v-chip>
                  <v-chip v-else-if="user.opened" color="green" size="x-small" prepend-icon="mdi-email-open-outline">Megnyitotta</v-chip>
                  <v-chip v-else color="grey" variant="outline" size="x-small">Nem látta</v-chip>
                </td>
                <td class="text-center text-caption text-grey">
                  {{ user.clicked ? user.clickedAt : (user.opened ? user.openedAt : '–') }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer />
          <v-btn variant="flat" color="primary" @click="activityDialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'

const route = useRoute()

/* STATE */
const search = ref("")
const filterStatus = ref(null)
const filterDate = ref(null)
const filterCampaign = ref(route.query.campaignId || null)

const previewDialog = ref(false)
const activityDialog = ref(false)

const selectedItem = ref(null)
const selectedTemplate = ref({})
const selectedItemActivity = ref([])

/* FETCH DATA */
const { data, pending, refresh } = await useAsyncData(
  "delivery-log",
  () => $fetch("/api/newsletter/getscheduled", { method: "POST" })
)

const { data: campaigns } = await useAsyncData(
  "campaigns-for-filter",
  () => $fetch("/api/campaigns")
)

const list = computed(() => data.value?.scheduledNewsletters || [])
const campaignOptions = computed(() => campaigns.value || [])

/* HELPERS */
const getCampaignName = (id) => {
  const c = campaignOptions.value.find(curr => curr._id === id)
  return c ? c.name : 'Manuális küldés'
}

const calculateRate = (part, total) => {
  if (!part || !total) return 0
  return Math.round((part / total) * 100)
}

/* TABLE HEADERS */
const headers = [
  { title: "Hírlevél neve / Tárgy", key: "subject", width: '35%' },
  { title: "Kampány", key: "campaignId" },
  { title: "Küldési idő", key: "sendDate" },
  { title: "Megnyitás", key: "opens", align: 'center' },
  { title: "Kattintás", key: "clicks", align: 'center' },
  { title: "Státusz", key: "sent", align: 'center' },
  { title: "Műveletek", key: "actions", sortable: false, align: 'end' }
]

const statusOptions = [
  { title: "Elküldve", value: true },
  { title: "Függőben", value: false }
]

/* FILTERED LIST */
const filteredList = computed(() => {
  return list.value.filter(item => {
    const matchesSearch = !search.value || 
      item.subject.toLowerCase().includes(search.value.toLowerCase()) ||
      item.subscribers?.some(s => s.toLowerCase().includes(search.value.toLowerCase()))

    const matchesStatus = filterStatus.value === null || item.sent === filterStatus.value
    const matchesDate = !filterDate.value || item.sendDate?.substring(0, 10) === filterDate.value
    const matchesCampaign = !filterCampaign.value || item.campaignId === filterCampaign.value

    return matchesSearch && matchesStatus && matchesDate && matchesCampaign
  })
})

/* PREVIEW */
async function openPreview(item) {
  selectedItem.value = item
  const res = await $fetch("/api/newsletter/getonetemplate", {
    method: "POST",
    body: { _id: item.templateId }
  })
  selectedTemplate.value = res.oneNewsletter
  previewDialog.value = true
}

/* ACTIVITY (DEEP DRILL) */
function openActivity(item) {
  selectedItem.value = item
  
  // Összefésüljük a feliratkozókat az eseményekkel (Backendről jövő opens/clicks alapján)
  const activityMap = item.subscribers.map(email => {
    // A backend aggregáció már visszaadja az opens/clicks listát a levélhez
    const openEvent = item.opens?.find(o => o.email === email)
    const clickEvent = item.clicks?.find(c => c.email === email)
    
    return {
      email,
      opened: !!openEvent,
      openedAt: openEvent ? new Date(openEvent.openedAt).toLocaleString('hu-HU') : '–',
      clicked: !!clickEvent,
      clickedAt: clickEvent ? new Date(clickEvent.timestamp || clickEvent.clickedAt).toLocaleString('hu-HU') : '–'
    }
  })

  // Sorbarendezés: aki kattintott/nyitott, az legyen elöl
  selectedItemActivity.value = activityMap.sort((a, b) => b.opened - a.opened || b.clicked - a.clicked)
  activityDialog.value = true
}
</script>

<style scoped>
.v-data-table :deep(thead) {
  background-color: #f8fafc;
}
</style>