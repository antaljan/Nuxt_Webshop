<template>
  <section class="p-6 space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">
        Feliratkozó aktivitása – {{ subscriber?.firstname }} {{ subscriber?.name }}
      </h1>

      <v-btn
        color="grey"
        variant="text"
        to="/admin/newsletter/subscribers"
        prepend-icon="mdi-arrow-left"
      >
        Vissza
      </v-btn>
    </div>

    <!-- SUBSCRIBER INFO -->
    <v-card class="p-6 space-y-2">
      <p><strong>Email:</strong> {{ subscriber?.email }}</p>
      <p><strong>Nyelv:</strong> {{ subscriber?.language?.toUpperCase() }}</p>
      <p><strong>Csoport:</strong> {{ subscriber?.group }}</p>
    </v-card>

    <!-- FILTERS -->
    <v-card class="p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <v-select
          v-model="filterType"
          :items="[
            { title: 'Összes', value: null },
            { title: 'Megnyitások', value: 'open' },
            { title: 'Kattintások', value: 'click' }
          ]"
          label="Aktivitás típusa"
          variant="outlined"
          clearable
        />

        <v-select
          v-model="filterCampaign"
          :items="campaignOptions"
          item-title="name"
          item-value="_id"
          label="Kampány"
          variant="outlined"
          clearable
        />

        <v-text-field
          v-model="filterDate"
          type="date"
          label="Dátum"
          variant="outlined"
          clearable
        />

      </div>
    </v-card>

    <!-- ACTIVITY LIST -->
    <v-card>
      <v-data-table
        :items="filteredActivity"
        :headers="headers"
        :loading="pending"
        class="elevation-1"
      >

        <!-- TYPE -->
        <template #item.type="{ item }">
          <v-chip
            :color="item.type === 'open' ? 'green' : 'blue'"
            text-color="white"
            size="small"
          >
            {{ item.type === 'open' ? 'Megnyitás' : 'Kattintás' }}
          </v-chip>
        </template>

        <!-- ACTIONS -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            variant="text"
            @click="openPreview(item)"
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

  </section>
</template>

<script setup>
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'

const route = useRoute()
const email = route.params.id

/* FETCH SUBSCRIBER */
const { data: subscriberData } = await useAsyncData(
  `subscriber-${email}`,
  () => $fetch('/api/newsletter/subscribers', { method: 'POST' })
)

const subscriber = computed(() =>
  subscriberData.value?.subscribers?.find(s => s.email === email)
)

/* FETCH ACTIVITY */
const { data: activityData, pending } = await useAsyncData(
  `activity-${email}`,
  () => $fetch(`/api/newsletter/activity/${email}`)
)

const activity = computed(() => activityData.value?.activity || [])

/* FETCH CAMPAIGNS */
const { data: campaigns } = await useAsyncData(
  "campaigns-for-activity",
  () => $fetch("/api/campaigns")
)

const campaignOptions = computed(() => campaigns.value || [])

/* FILTERS */
const filterType = ref(null)
const filterCampaign = ref(null)
const filterDate = ref(null)

/* TABLE HEADERS */
const headers = [
  { title: "Típus", key: "type" },
  { title: "Kampány", key: "campaignName" },
  { title: "Hírlevél", key: "subject" },
  { title: "Időpont", key: "date" },
  { title: "URL (kattintásnál)", key: "url" },
  { title: "Műveletek", key: "actions", sortable: false }
]

/* FILTERED ACTIVITY */
const filteredActivity = computed(() => {
  return activity.value.filter(a => {
    const matchesType =
      !filterType.value || a.type === filterType.value

    const matchesCampaign =
      !filterCampaign.value || a.campaignId === filterCampaign.value

    const matchesDate =
      !filterDate.value || a.date.substring(0, 10) === filterDate.value

    return matchesType && matchesCampaign && matchesDate
  })
})

/* PREVIEW */
const previewDialog = ref(false)
const selectedItem = ref({})
const selectedTemplate = ref({})

async function openPreview(item) {
  selectedItem.value = item

  const res = await $fetch("/api/newsletter/getonetemplate", {
    method: "POST",
    body: { _id: item.templateId }
  })

  selectedTemplate.value = res.oneNewsletter
  previewDialog.value = true
}
</script>
