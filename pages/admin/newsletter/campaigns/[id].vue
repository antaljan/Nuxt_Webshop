<template>
  <section class="p-6 space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Kampány szerkesztése</h1>
      <v-btn color="grey" variant="text" to="/admin/newsletter/campaigns" prepend-icon="mdi-arrow-left">
        Vissza
      </v-btn>
    </div>

    <v-progress-linear v-if="pending" indeterminate color="primary" />

    <template v-else>
      <v-card class="p-6 space-y-4">
        <h2 class="text-xl font-semibold">Kampány adatai</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <v-text-field v-model="campaign.name" label="Kampány neve" variant="outlined" required />
          <v-text-field v-model="campaign.slug" label="Kampány URL Slug" variant="outlined" />
        </div>

        <v-textarea v-model="campaign.description" label="Leírás" variant="outlined" rows="3" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <v-select
            v-model="campaign.type"
            :items="[
              { title: 'Egyszeri (Broadcast)', value: 'broadcast' },
              { title: 'Automatizált (Welcome/Lead Magnet)', value: 'automated' }
            ]"
            label="Kampány típusa"
            variant="outlined"
          />
          <v-select
            v-model="campaign.status"
            :items="[
              { title: 'Piszkozat', value: 'draft' },
              { title: 'Aktív', value: 'active' },
              { title: 'Szüneteltetve', value: 'paused' },
              { title: 'Leállítva', value: 'stopped' }
            ]"
            label="Státusz"
            variant="outlined"
          />
        </div>
      </v-card>

      <v-card class="p-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kampány e-mailek</h2>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="addEmail">
            Új e-mail hozzáadása
          </v-btn>
        </div>

        <div v-for="(email, index) in campaign.newsletters" :key="index">
          <v-card class="p-4 mb-4 border-l-4" :class="campaign.type === 'automated' ? 'border-primary' : 'border-success'">
            
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">E-mail #{{ index + 1 }}</h3>
              <v-btn icon="mdi-delete" color="red" variant="text" @click="removeEmail(index)" />
            </div>

            <div class="flex items-center gap-2">
              <v-btn icon="mdi-eye" variant="text" @click="openPreview(email)" />
              <v-select
                v-model="email.templateId"
                :items="templateOptions"
                item-title="subject"
                item-value="_id"
                label="Hírlevél sablon"
                variant="outlined"
                class="flex-grow"
                required
              />
            </div>

            <div v-if="campaign.type === 'broadcast'">
              <v-text-field
                v-model="email.sendDate"
                type="datetime-local"
                label="Küldési időpont"
                variant="outlined"
              />
              <v-btn variant="text" prepend-icon="mdi-account-multiple" @click="openSubscriberSelector(index)">
                Címzettek ({{ email.subscribers.length }})
              </v-btn>
            </div>

            <div v-else class="flex gap-4 items-center">
              <v-text-field
                v-model.number="email.offset"
                type="number"
                label="Eltolás"
                variant="outlined"
              />
              <v-select
                v-model="email.unit"
                :items="[
                  { title: 'Perc', value: 'minutes' },
                  { title: 'Óra', value: 'hours' },
                  { title: 'Nap', value: 'days' }
                ]"
                label="Időegység"
                variant="outlined"
              />
              <div class="text-caption text-grey pb-4">
                (A feliratkozástól számítva)
              </div>
            </div>
          </v-card>
        </div>
      </v-card>

      <div class="flex justify-end mt-6">
        <v-btn color="success" size="large" prepend-icon="mdi-content-save" @click="saveCampaign">
          Kampány frissítése
        </v-btn>
      </div>
    </template>

    <NewsletterPreviewDialog v-model="previewDialog" :template="selectedTemplate" />
    <SubscriberSelector v-model="subscriberDialog" :selected="subscriberTempList" @update:selected="applySubscribers" />
  </section>
</template>

<script setup>
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'
import SubscriberSelector from '~/components/admin/newsletter/SubscriberSelector.vue'

const route = useRoute()
const campaignId = route.params.id
const { fetchTemplates, fetchCampaign } = useNewsletter()

const previewDialog = ref(false)
const selectedTemplate = ref(null)
const subscriberDialog = ref(false)
const subscriberTargetIndex = ref(null)
const subscriberTempList = ref([])

/* STATE */
const campaign = reactive({
  name: "",
  slug: "",
  description: "",
  status: "draft",
  type: "broadcast",
  newsletters: []
})

/* FETCH DATA */
const { data: campaignData, pending } = await useAsyncData(
  () => `campaign-${campaignId}`,
  () => fetchCampaign(campaignId)
)

/* ADATOK BETÖLTÉSE ÉS ÁTALAKÍTÁSA */
watchEffect(() => {
  if (!campaignData.value) return
  const c = campaignData.value.campaign || campaignData.value

  campaign.name = c.name
  campaign.slug = c.slug
  campaign.description = c.description
  campaign.status = c.status
  campaign.type = c.type || 'broadcast'

  campaign.newsletters = c.newsletters.map(n => {
    // Visszaalakítás: percekből -> nap/óra/perc a UI számára
    let displayOffset = n.offset || 0
    let displayUnit = 'minutes'

    if (campaign.type === 'automated' && n.offset > 0) {
      if (n.offset % 1440 === 0) {
        displayOffset = n.offset / 1440
        displayUnit = 'days'
      } else if (n.offset % 60 === 0) {
        displayOffset = n.offset / 60
        displayUnit = 'hours'
      }
    }

    return {
      templateId: n.templateId,
      sendDate: n.sendDate ? n.sendDate.substring(0, 16) : "",
      subscribers: n.subscribers || [],
      offset: displayOffset,
      unit: displayUnit
    }
  })
})

const { data: templates } = await useAsyncData("templates", () => fetchTemplates())
const templateOptions = computed(() => templates.value?.allNewsletters || [])

function addEmail() {
  campaign.newsletters.push({
    templateId: "",
    sendDate: "",
    offset: 0,
    unit: "minutes",
    subscribers: []
  })
}

function removeEmail(index) {
  campaign.newsletters.splice(index, 1)
}

/* SAVE (UPDATE) */
async function saveCampaign() {
  const payload = {
    ...campaign,
    newsletters: campaign.newsletters.map(n => {
      let calculatedOffset = 0
      if (campaign.type === 'automated') {
        const val = parseInt(n.offset) || 0
        calculatedOffset = n.unit === 'days' ? val * 1440 : (n.unit === 'hours' ? val * 60 : val)
      }

      return {
        templateId: n.templateId,
        subscribers: campaign.type === 'broadcast' ? n.subscribers : [],
        sendDate: campaign.type === 'broadcast' ? n.sendDate : null,
        offset: campaign.type === 'automated' ? calculatedOffset : null
      }
    })
  }

  await $fetch(`/api/campaigns/${campaignId}`, {
    method: "PUT",
    body: payload
  })

  navigateTo("/admin/newsletter/campaigns")
}

/* HELPER FUNCS (Preview, Selector) */
async function openPreview(email) {
  if (!email.templateId) return alert("Válassz sablont!")
  const tpl = await $fetch('/api/newsletter/getonetemplate', {
    method: 'POST',
    body: { _id: email.templateId }
  })
  selectedTemplate.value = tpl.oneNewsletter
  previewDialog.value = true
}

function openSubscriberSelector(index) {
  subscriberTargetIndex.value = index
  subscriberTempList.value = [...campaign.newsletters[index].subscribers]
  subscriberDialog.value = true
}

function applySubscribers(list) {
  campaign.newsletters[subscriberTargetIndex.value].subscribers = list
}
</script>