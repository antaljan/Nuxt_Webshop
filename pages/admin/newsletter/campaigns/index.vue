<template>
  <section class="p-6 space-y-6">

      <!-- BACK BUTTON -->
      <v-btn
        color="primary"
        variant="text"
        prepend-icon="mdi-arrow-left"
        to="/admin/newsletter"
        class="mb-4"
      >
        Vissza a hírlevelekhez
      </v-btn>
      
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Kampányok</h1>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        to="/admin/newsletter/campaigns/create"
      >
        Új kampány
      </v-btn>
    </div>

    <!-- CAMPAIGN LIST -->
    <v-card>
      <v-card-title class="text-lg font-semibold">
        Összes kampány
      </v-card-title>

      <v-data-table
        :items="campaigns || []"
        :loading="pending"
        :headers="headers"
        class="elevation-1"
      >

        <!-- STATUS BADGE -->
        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            text-color="white"
            size="small"
          >
            {{ statusLabel(item.status) }}
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
            icon="mdi-pencil"
            variant="text"
            :to="`/admin/newsletter/campaigns/${item._id}`"
          />

          <v-btn
            icon="mdi-pause"
            variant="text"
            v-if="item.status === 'active'"
            @click="pauseCampaign(item)"
          />

          <v-btn
            icon="mdi-play"
            variant="text"
            v-if="item.status === 'paused'"
            @click="resumeCampaign(item)"
          />

          <v-btn
            icon="mdi-stop"
            variant="text"
            v-if="item.status !== 'stopped'"
            @click="stopCampaign(item)"
          />

          <v-btn
            icon="mdi-delete"
            variant="text"
            color="red"
            @click="deleteCampaign(item)"
          />
        </template>

      </v-data-table>
    </v-card>

    <!-- PREVIEW DIALOG -->
    <NewsletterPreviewDialog
      v-model="previewDialog"
      :campaign="selectedCampaign"
      :template="selectedTemplate"
    />

  </section>
</template>

<script setup>
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'

/* FETCH CAMPAIGNS */
const { fetchCampaigns } = useNewsletter()

const { data: campaigns, pending, refresh } = await useAsyncData(
  'campaigns-list',
  () => fetchCampaigns()
)

/* TABLE HEADERS */
const headers = [
  { title: 'Név', key: 'name' },
  { title: 'Leírás', key: 'description' },
  { title: 'Státusz', key: 'status' },
  { title: 'Következő küldés', key: 'nextSend' },
  { title: 'Megnyitás %', key: 'openRate' },
  { title: 'Kattintás %', key: 'clickRate' },
  { title: 'Műveletek', key: 'actions', sortable: false }
]

/* STATUS LABELS */
function statusLabel(status) {
  return {
    active: 'Aktív',
    paused: 'Szüneteltetve',
    stopped: 'Leállítva',
    draft: 'Piszkozat'
  }[status] || status
}

function statusColor(status) {
  return {
    active: 'green',
    paused: 'orange',
    stopped: 'red',
    draft: 'grey'
  }[status] || 'grey'
}

/* PREVIEW */
const previewDialog = ref(false)
const selectedCampaign = ref({})
const selectedTemplate = ref({})

async function openPreview(item) {
  // 1) Kampány + scheduled elemek lekérése
  const res = await $fetch(`/api/campaigns/${item._id}`, { method: 'GET' })

  const scheduled = res.scheduled
  if (!scheduled.length) {
    return alert('Ehhez a kampányhoz nincs ütemezett hírlevél')
  }

  // 2) Az első scheduled elem template-je
  const templateId = scheduled[0].templateId

  const tpl = await $fetch('/api/newsletter/getonetemplate', {
    method: 'POST',
    body: { _id: templateId }
  })

  selectedCampaign.value = res.campaign
  selectedTemplate.value = tpl.oneNewsletter
  previewDialog.value = true
}


/* ACTIONS */
async function pauseCampaign(item) {
  await $fetch(`/api/campaigns/${item._id}/pause`, { method: 'PUT' })
  await refresh()
}

async function resumeCampaign(item) {
  await $fetch(`/api/campaigns/${item._id}/resume`, { method: 'PUT' })
  await refresh()
}

async function stopCampaign(item) {
  await $fetch(`/api/campaigns/${item._id}/stop`, { method: 'PUT' })
  await refresh()
}

async function deleteCampaign(item) {
  if (!confirm('Biztosan törlöd a kampányt?')) return
  await $fetch(`/api/campaigns/${item._id}`, { method: 'DELETE' })
  await refresh()
}
</script>
