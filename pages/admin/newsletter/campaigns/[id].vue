<template>
  <section class="p-6 space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Kampány szerkesztése</h1>

      <v-btn
        color="grey"
        variant="text"
        to="/admin/newsletter"
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

            <!-- FILTERS -->
            <h4 class="text-md font-semibold mt-4">Célcsoport szűrők</h4>

            <v-select
              v-model="email.filters.language"
              :items="languages"
              label="Nyelv"
              multiple
              variant="outlined"
            />

            <v-select
              v-model="email.filters.group"
              :items="groups"
              label="Csoport"
              multiple
              variant="outlined"
            />

            <v-textarea
              v-model="email.filters.customSubscribers"
              label="Egyedi e-mail címek (soronként egy)"
              variant="outlined"
              rows="3"
            />
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

  </section>
</template>

<script setup>
/* IMPORTS */
const route = useRoute()
const campaignId = route.params.id

const { fetchTemplates, fetchCampaign } = useNewsletter()

/* STATE */
const campaign = reactive({
  name: "",
  description: "",
  status: "draft",
  newsletters: []
})

/* FETCH CAMPAIGN */
const { data: campaignData, pending } = await useAsyncData(
  `campaign-${campaignId}`,
  () => fetchCampaign(campaignId)
)

/* APPLY LOADED DATA */
watchEffect(() => {
  if (!campaignData.value) return

  const c = campaignData.value.campaign

  campaign.name = c.name
  campaign.description = c.description
  campaign.status = c.status
  campaign.newsletters = c.newsletters.map(n => ({
    templateId: n.templateId,
    sendDate: n.sendDate ? n.sendDate.substring(0, 16) : "",
    filters: {
      language: n.filters?.language || [],
      group: n.filters?.group || [],
      customSubscribers: (n.filters?.customSubscribers || []).join("\n")
    }
  }))
})

/* TEMPLATE OPTIONS */
const { data: templates } = await useAsyncData(
  "templates",
  () => fetchTemplates()
)

const templateOptions = computed(() => templates.value?.allNewsletters || [])

/* LANGUAGES + GROUPS */
const languages = [
  { title: "HU", value: "hu" },
  { title: "EN", value: "en" }
]

const groups = [
  { title: "Újonc", value: "ujjonc" },
  { title: "VIP", value: "vip" },
  { title: "Coaching", value: "coaching" }
]

/* ADD EMAIL */
function addEmail() {
  campaign.newsletters.push({
    templateId: "",
    sendDate: "",
    filters: {
      language: [],
      group: [],
      customSubscribers: ""
    }
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
      ...n,
      filters: {
        ...n.filters,
        customSubscribers: n.filters.customSubscribers
          ? n.filters.customSubscribers.split("\n").map(e => e.trim())
          : []
      }
    }))
  }

  await $fetch(`/api/campaigns/${campaignId}`, {
    method: "PUT",
    body: payload
  })

  navigateTo("/admin/newsletter")
}
</script>
