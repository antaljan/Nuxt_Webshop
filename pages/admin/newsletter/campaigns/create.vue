<template>
  <section class="p-6 space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Új kampány létrehozása</h1>

      <v-btn
        color="grey"
        variant="text"
        to="/admin/newsletter/campaigns"
        prepend-icon="mdi-arrow-left"
      >
        Vissza
      </v-btn>
    </div>

    <!-- CAMPAIGN INFO -->
    <v-card class="p-6 space-y-4">
      <h2 class="text-xl font-semibold">Kampány adatai</h2>  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <v-text-field v-model="campaign.name" label="Kampány neve" variant="outlined" />
        <v-text-field v-model="campaign.slug" label="Kampány URL Slug (pl. stressz-ebook)" variant="outlined" />
      </div>
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
            { title: 'Aktív', value: 'active' }
          ]"
          label="Státusz"
          variant="outlined"
        />
      </div>
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

      <div class="flex items-center gap-2 mb-4">
        <v-btn
          icon="mdi-eye"
          variant="text"
          color="blue"
          title="Előnézet"
          @click="openPreview(email)"
        />
        <v-select
          v-model="email.templateId"
          :items="templateOptions"
          item-title="subject"
          item-value="_id"
          label="Hírlevél sablon kiválasztása"
          variant="outlined"
          class="flex-grow"
          hide-details
          required
        />
      </div>
      <v-divider class="mb-4" />

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
          label="Eltolás mértéke"
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
        <div class="text-caption text-grey">
          (A feliratkozástól számítva. A 0 = azonnali.)
        </div>
      </div>
    </v-card>
  </div>
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
        Kampány mentése
      </v-btn>
    </div>

    <!-- PREVIEW DIALOG -->
    <NewsletterPreviewDialog
      v-model="previewDialog"
      :template="selectedTemplate"
    />

    <!-- SUBSCRIBER SELECTOR -->
    <SubscriberSelector
      v-model="subscriberDialog"
      :selected="subscriberTempList"
      @update:selected="applySubscribers"
    />

  </section>
</template>

<script setup>
import NewsletterPreviewDialog from '~/components/admin/newsletter/NewsletterPreviewDialog.vue'
import SubscriberSelector from '~/components/admin/newsletter/SubscriberSelector.vue'

const { fetchTemplates } = useNewsletter()

/* STATE */
const campaign = reactive({
  name: "",
  slug: "", // Szükséges az azonosításhoz (pl. 'welcome' vagy 'stressz-ebook')
  description: "",
  status: "draft",
  type: "broadcast", // Alapértelmezett típus
  newsletters: []
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
    sendDate: "", // Broadcast esetén
    offset: 0,    // Automated esetén
    unit: "minutes", // Automated esetén
    subscribers: []
  })
}

/* REMOVE EMAIL */
function removeEmail(index) {
  campaign.newsletters.splice(index, 1)
}

/* SAVE CAMPAIGN */
async function saveCampaign() {
  // Validáció (opcionális, de ajánlott)
  if (!campaign.name) return alert("A kampány neve kötelező!");

  const payload = {
    ...campaign,
    // Automatikus slug generálás, ha nincs megadva (kisbetűs, ékezetmentes, kötőjeles)
    slug: campaign.slug || campaign.name
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Ékezetek eltávolítása
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, ''),

    newsletters: campaign.newsletters.map(n => {
      // Percre váltás logikája
      let calculatedOffset = 0;
      if (campaign.type === 'automated') {
        const offsetVal = parseInt(n.offset) || 0;
        if (n.unit === 'days') {
          calculatedOffset = offsetVal * 1440; // 24 * 60
        } else if (n.unit === 'hours') {
          calculatedOffset = offsetVal * 60;
        } else {
          calculatedOffset = offsetVal; // alapból minutes
        }
      }

      return {
        templateId: n.templateId,
        // Ha broadcast, visszük a kiválasztott listát, ha automated, üres marad
        subscribers: campaign.type === 'broadcast' ? n.subscribers : [],
        // Ha broadcast, visszük a fix dátumot, ha automated, null
        sendDate: campaign.type === 'broadcast' ? n.sendDate : null,
        // Az automated mezők
        offset: campaign.type === 'automated' ? calculatedOffset : null,
        // Eredeti értékeket is elmenthetjük, ha később szerkeszteni akarjuk a UI-on
        displayOffset: n.offset,
        displayUnit: n.unit
      };
    })
  };

  try {
    await $fetch("/api/campaigns/create", {
      method: "POST",
      body: payload
    });
    
    // Sikeres mentés után visszairányítás
    navigateTo("/admin/newsletter/campaigns");
  } catch (err) {
    console.error("Hiba a mentés során:", err);
    alert("Nem sikerült elmenteni a kampányt.");
  }
}

/* PREVIEW */
const previewDialog = ref(false)
const selectedTemplate = ref(null)

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

/* SUBSCRIBER SELECTOR */
const subscriberDialog = ref(false)
const subscriberTargetIndex = ref(null)
const subscriberTempList = ref([])

function openSubscriberSelector(index) {
  subscriberTargetIndex.value = index
  subscriberTempList.value = [...campaign.newsletters[index].subscribers]
  subscriberDialog.value = true
}

function applySubscribers(list) {
  campaign.newsletters[subscriberTargetIndex.value].subscribers = list
}
</script>
