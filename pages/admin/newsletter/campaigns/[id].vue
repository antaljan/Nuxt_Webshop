<template>
  <section class="p-6 space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Kampány szerkesztése</h1>

      <v-btn
        color="grey"
        variant="text"
        to="/admin/newsletter/campaigns"
        prepend-icon="mdi-arrow-left"
      >
        Vissza
      </v-btn>
    </div>

    <!-- LOADING -->
    <v-progress-linear
      v-if="pending"
      indeterminate
      color="primary"
    />

    <template v-else>

      <!-- CAMPAIGN INFO -->
      <v-card class="p-6 space-y-4">
        <h2 class="text-xl font-semibold">Kampány adatai</h2>

        <v-text-field
          v-model="campaign.name"
          label="Kampány neve"
          variant="outlined"
          required
        />

        <v-textarea
          v-model="campaign.description"
          label="Leírás"
          variant="outlined"
          rows="3"
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
      </v-card>

      <!-- EMAIL STEPS -->
      <v-card class="p-6 space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kampány e-mailek</h2>

          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="addEmail"
          >
            Új e-mail hozzáadása
          </v-btn>
        </div>

        <div v-for="(email, index) in campaign.newsletters" :key="index">
          <v-card class="p-4 mb-4">

            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">E-mail #{{ index + 1 }}</h3>

              <v-btn
                icon="mdi-delete"
                color="red"
                variant="text"
                @click="removeEmail(index)"
              />
            </div>

            <!-- TEMPLATE SELECT -->
            <v-btn
              icon="mdi-eye"
              variant="text"
              @click="openPreview(email)"
            />

            <v-select
              v-model="email.templateId"
              :items="templateOptions"
              item-title="subject"
              item-value="_id"
              label="Hírlevél sablon"
              variant="outlined"
              required
            />

            <!-- SEND DATE -->
            <v-text-field
              v-model="email.sendDate"
              type="datetime-local"
              label="Küldési időpont"
              variant="outlined"
              required
            />

            <!-- SUBSCRIBER LIST -->
            <v-btn
              variant="text"
              prepend-icon="mdi-account-multiple"
              @click="openSubscriberSelector(index)"
            >
              Címzettek ({{ email.subscribers.length }})
            </v-btn>

          </v-card>
        </div>
      </v-card>

      <!-- SAVE BUTTON -->
      <div class="flex justify-end">
        <v-btn
          color="success"
          size="large"
          prepend-icon="mdi-content-save"
          @click="saveCampaign"
        >
          Kampány frissítése
        </v-btn>
      </div>

    </template>

    <NewsletterPreviewDialog
      v-model="previewDialog"
      :template="selectedTemplate"
    />

    <SubscriberSelector
      v-model="subscriberDialog"
      :selected="subscriberTempList"
      @update:selected="applySubscribers"
    />

  </section>
</template>

<script setup>
/* IMPORTS */
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'
import { renderNewsletterPreview } from '~/utils/newsletter/render'
import SubscriberSelector from '~/components/admin/newsletter/SubscriberSelector.vue'


const previewDialog = ref(false)
const selectedTemplate = ref(null)

const route = useRoute()
const campaignId = route.params.id

const { fetchTemplates, fetchCampaign } = useNewsletter()

const subscriberDialog = ref(false)
const subscriberTargetIndex = ref(null)
const subscriberTempList = ref([])


/* STATE */
const campaign = reactive({
  name: "",
  description: "",
  status: "draft",
  newsletters: []
})

/* FETCH CAMPAIGN */
const { data: campaignData, pending } = await useAsyncData(
  () => `campaign-${route.params.id}`,
  () => fetchCampaign(route.params.id),
  { watch: [() => route.params.id] }
)


/* APPLY LOADED DATA */
watchEffect(() => {
  
  if (!campaignData.value) return

const c = campaignData.value.campaign || campaignData.value

  campaign.name = c.name
  campaign.description = c.description
  campaign.status = c.status
  campaign.newsletters = c.newsletters.map(n => ({
    templateId: n.templateId,
    sendDate: n.sendDate ? n.sendDate.substring(0, 16) : "",
    subscribers: n.subscribers || []   // <-- EZ A LÉNYEG
  }))
})

/* TEMPLATE OPTIONS */
const { data: templates } = await useAsyncData(
  "templates",
  () => fetchTemplates()
)

const templateOptions = computed(() => templates.value?.allNewsletters || [])

/* ADD EMAIL */
function addEmail() {
  campaign.newsletters.push({
    templateId: "",
    sendDate: "",
    subscribers: []
  })
}

/* REMOVE EMAIL */
function removeEmail(index) {
  campaign.newsletters.splice(index, 1)
}

/* SAVE CAMPAIGN */
async function saveCampaign() {
  const payload = {
    ...campaign,
    newsletters: campaign.newsletters.map(n => ({
      templateId: n.templateId,
      sendDate: n.sendDate,
      subscribers: n.subscribers
    }))
  }

  await $fetch(`/api/campaigns/${campaignId}`, {
    method: "PUT",
    body: payload
  })

  navigateTo("/admin/newsletter")
}

/* PREVIEW DIALOG */
async function openPreview(email) {
  if (!email.templateId) {
    return alert("Ehhez az e-mailhez nincs kiválasztott sablon.")
  }

  const tpl = await $fetch('/api/newsletter/getonetemplate', {
    method: 'POST',
    body: { _id: email.templateId }
  })

  selectedTemplate.value = tpl.oneNewsletter
  previewDialog.value = true
}

/* SUBSCRIBER SELECTOR DIALOG */
function openSubscriberSelector(index) {
  subscriberTargetIndex.value = index
  subscriberTempList.value = [...campaign.newsletters[index].subscribers]
  subscriberDialog.value = true
}

/* APPLY SELECTED SUBSCRIBERS */
function applySubscribers(list) {
  campaign.newsletters[subscriberTargetIndex.value].subscribers = list
}


</script>
