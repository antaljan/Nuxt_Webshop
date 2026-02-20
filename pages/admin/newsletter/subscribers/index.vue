<template>
  <section class="p-6 space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Feliratkozók kezelése</h1>

      <v-btn
        color="success"
        prepend-icon="mdi-account-plus"
        @click="openNewSubscriber"
      >
        Új feliratkozó
      </v-btn>
    </div>

    <!-- FILTERS -->
    <v-card class="p-4 space-y-4">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <!-- SEARCH -->
        <v-text-field
          v-model="search"
          label="Keresés név vagy email alapján"
          prepend-icon="mdi-magnify"
          variant="outlined"
          clearable
        />

        <!-- LANGUAGE FILTER -->
        <v-select
          v-model="filterLanguage"
          :items="languages"
          label="Nyelv"
          variant="outlined"
          clearable
        />

        <!-- GROUP FILTER -->
        <v-select
          v-model="filterGroup"
          :items="groups"
          label="Csoport"
          variant="outlined"
          clearable
        />

      </div>

    </v-card>

    <!-- SUBSCRIBER TABLE -->
    <v-card>
      <v-data-table
        :items="filteredSubscribers"
        :headers="headers"
        :loading="pending"
        class="elevation-1"
      >

        <!-- LANGUAGE -->
        <template #item.language="{ item }">
          <v-chip size="small" color="primary" text-color="white">
            {{ item.language.toUpperCase() }}
          </v-chip>
        </template>

        <!-- GROUP -->
        <template #item.group="{ item }">
          <v-chip size="small" color="secondary" text-color="white">
            {{ item.group }}
          </v-chip>
        </template>

        <!-- ACTIONS -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            @click="openEditSubscriber(item)"
          />

          <v-btn
            icon="mdi-delete"
            variant="text"
            color="red"
            @click="confirmDelete(item)"
          />
        </template>

      </v-data-table>
    </v-card>

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
import NewsletterSubscriberDialog from '~/components/admin/newsletter/NewsletterSubscriberDialog.vue'
const { fetchSubscribers, deleteSubscriber } = useNewsletter()

/* STATE */
const search = ref("")
const filterLanguage = ref(null)
const filterGroup = ref(null)

const editDialog = ref(false)
const isEditMode = ref(false)
const editingSubscriber = ref({})

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

/* FETCH SUBSCRIBERS */
const { data, pending, refresh } = await useAsyncData(
  "subscribers-list",
  () => fetchSubscribers()
)

const subscribers = computed(() => data.value?.subscribers || [])

/* TABLE HEADERS */
const headers = [
  { title: "Név", key: "firstname" },
  { title: "Vezetéknév", key: "name" },
  { title: "Email", key: "email" },
  { title: "Nyelv", key: "language" },
  { title: "Csoport", key: "group" },
  { title: "Műveletek", key: "actions", sortable: false }
]

/* FILTERED LIST */
const filteredSubscribers = computed(() => {
  return subscribers.value.filter(s => {
    const matchesSearch =
      !search.value ||
      s.firstname?.toLowerCase().includes(search.value.toLowerCase()) ||
      s.name?.toLowerCase().includes(search.value.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.value.toLowerCase())

    const matchesLanguage =
      !filterLanguage.value || s.language === filterLanguage.value

    const matchesGroup =
      !filterGroup.value || s.group === filterGroup.value

    return matchesSearch && matchesLanguage && matchesGroup
  })
})

/* CRUD ACTIONS */
function openNewSubscriber() {
  isEditMode.value = false
  editingSubscriber.value = {
    firstname: "",
    name: "",
    email: "",
    group: "ujjonc",
    language: "hu"
  }
  editDialog.value = true
}

function openEditSubscriber(item) {
  isEditMode.value = true
  editingSubscriber.value = { ...item }
  editDialog.value = true
}

async function saveSubscriber(subscriber) {
  const url = isEditMode.value ? "/api/newsletter/subscriber" : "/api/newsletter/subscribe"
  const method = isEditMode.value ? "PUT" : "POST"

  await $fetch(url, { method, body: subscriber })
  editDialog.value = false
  await refresh()
}

async function confirmDelete(item) {
  if (!confirm("Biztosan törlöd?")) return
  await deleteSubscriber(item.email)
  await refresh()
}
</script>
