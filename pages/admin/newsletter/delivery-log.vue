<template>
  <section class="p-6 space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Kézbesítési napló</h1>

      <v-btn
        color="grey"
        variant="text"
        to="/admin/newsletter"
        prepend-icon="mdi-arrow-left"
      >
        Vissza a dashboardra
      </v-btn>
    </div>

    <!-- FILTERS -->
    <v-card class="p-4 space-y-4">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- SEARCH -->
        <v-text-field
          v-model="search"
          label="Keresés tárgy vagy email alapján"
          prepend-icon="mdi-magnify"
          variant="outlined"
          clearable
        />

        <!-- STATUS FILTER -->
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Státusz"
          variant="outlined"
          clearable
        />

        <!-- DATE FILTER -->
        <v-text-field
          v-model="filterDate"
          type="date"
          label="Dátum"
          variant="outlined"
          clearable
        />

        <!-- CAMPAIGN FILTER -->
        <v-select
          v-model="filterCampaign"
          :items="campaignOptions"
          item-title="name"
          item-value="_id"
          label="Kampány"
          variant="outlined"
          clearable
        />
      </div>

    </v-card>

    <!-- DELIVERY TABLE -->
    <v-card>
      <v-data-table
        :items="filteredList"
        :headers="headers"
        :loading="pending"
        class="elevation-1"
      >

        <!-- STATUS -->
        <template #item.sent="{ item }">
          <v-chip
            :color="item.sent ? 'green' : 'orange'"
            text-color="white"
            size="small"
          >
            {{ item.sent ? 'Elküldve' : 'Függőben' }}
          </v-chip>
        </template>

        <!-- ACTIONS -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            variant="text"
            @click="openPreview(item)"
          />

          <v-btn
            icon="mdi-account-search"
            variant="text"
            @click="openActivity(item)"
          />
        </template>

      </v-data-table>
    </v-card>

    <!-- PREVIEW DIALOG -->
    <NewsletterPreviewDialog
      v-model="previewDialog"
      :campaign="selectedItem"
      :template="selectedTemplate"
    />

    <!-- ACTIVITY DIALOG -->
    <v-dialog v-model="activityDialog" max-width="600px">
      <v-card class="p-6">
        <h2 class="text-xl font-semibold mb-4">Feliratkozói aktivitás</h2>

        <div v-if="!selectedItemActivity">
          Nincs aktivitás adat.
        </div>

        <div v-else>
          <p><strong>Megnyitások:</strong> {{ selectedItemActivity.opens.length }}</p>
          <ul class="list-disc ml-6">
            <li v-for="o in selectedItemActivity.opens" :key="o.email">
              {{ o.email }} – {{ o.date }}
            </li>
          </ul>

          <p class="mt-4"><strong>Kattintások:</strong> {{ selectedItemActivity.clicks.length }}</p>
          <ul class="list-disc ml-6">
            <li v-for="c in selectedItemActivity.clicks" :key="c.email">
              {{ c.email }} – {{ c.date }}
            </li>
          </ul>
        </div>

        <v-card-actions class="justify-end mt-4">
          <v-btn color="primary" @click="activityDialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </section>
</template>

<script setup>
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'

/* STATE */
const search = ref("")
const filterStatus = ref(null)
const filterDate = ref(null)
const filterCampaign = ref(null)

const previewDialog = ref(false)
const activityDialog = ref(false)

const selectedItem = ref({})
const selectedTemplate = ref({})
const selectedItemActivity = ref(null)

/* FETCH SCHEDULED NEWSLETTERS */
const { data, pending, refresh } = await useAsyncData(
  "delivery-log",
  () => $fetch("/api/newsletter/getscheduled", { method: "POST" })
)

const list = computed(() => data.value?.scheduledNewsletters || [])

/* FETCH CAMPAIGNS FOR FILTER */
const { data: campaigns } = await useAsyncData(
  "campaigns-for-filter",
  () => $fetch("/api/campaigns")
)

const campaignOptions = computed(() => campaigns.value || [])

/* TABLE HEADERS */
const headers = [
  { title: "Tárgy", key: "subject" },
  { title: "Kampány", key: "campaignId" },
  { title: "Küldési idő", key: "sendDate" },
  { title: "Címzettek", key: "subscribers.length" },
  { title: "Megnyitások", key: "opens" },
  { title: "Kattintások", key: "clicks" },
  { title: "Státusz", key: "sent" },
  { title: "Műveletek", key: "actions", sortable: false }
]

/* STATUS OPTIONS */
const statusOptions = [
  { title: "Elküldve", value: true },
  { title: "Függőben", value: false }
]

/* FILTERED LIST */
const filteredList = computed(() => {
  return list.value.filter(item => {
    const matchesSearch =
      !search.value ||
      item.subject.toLowerCase().includes(search.value.toLowerCase()) ||
      item.subscribers.some(s => s.email.toLowerCase().includes(search.value.toLowerCase()))

    const matchesStatus =
      filterStatus.value === null || item.sent === filterStatus.value

    const matchesDate =
      !filterDate.value ||
      item.sendDate?.substring(0, 10) === filterDate.value

    const matchesCampaign =
      !filterCampaign.value ||
      item.campaignId === filterCampaign.value

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

/* ACTIVITY */
async function openActivity(item) {
  // később: külön tracking collectionből
  selectedItemActivity.value = {
    opens: item.opens || [],
    clicks: item.clicks || []
  }

  activityDialog.value = true
}
</script>
