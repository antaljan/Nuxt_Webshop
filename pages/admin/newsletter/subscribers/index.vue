<template>
  <section class="p-6 space-y-8">

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
      <h1 class="text-2xl font-bold">
        Feliratkozók kezelése
      </h1>

      <div class="flex gap-2">
        <v-btn
          color="secondary"
          prepend-icon="mdi-account-group"
          @click="groupDialog = true"
        >
          Csoportok
        </v-btn>

        <v-btn
          color="success"
          prepend-icon="mdi-account-plus"
          @click="openNewSubscriber"
        >
          Új feliratkozó
        </v-btn>
      </div>
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
        <template #item.groups="{ item }">
          <div class="flex flex-wrap gap-1">
            <v-chip
              v-for="group in item.groups"
              :key="group"
              size="small"
              color="secondary"
            >
              {{ group }}
            </v-chip>
          </div>
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
      :groups="groups"
      @save="saveSubscriber"
    />

    <!-- GROUP EDIT DIALOG -->
    <NewsletterGroupsDialog
      v-model="groupDialog"
      :groups="groupsData?.groups || []"
      @refresh="refreshGroups"
    />

  </section>
</template>

<script setup>
/* IMPORTS */
import NewsletterSubscriberDialog from '~/components/admin/newsletter/NewsletterSubscriberDialog.vue'
import NewsletterGroupsDialog from '~/components/admin/newsletter/NewsletterGroupsDialog.vue'
const { fetchSubscribers, deleteSubscriber } = useNewsletter()

/* STATE */
const search = ref("")
const filterLanguage = ref(null)
const filterGroup = ref(null)

const editDialog = ref(false)
const isEditMode = ref(false)
const editingSubscriber = ref({})

const groupDialog = ref(false)

/* LANGUAGES + GROUPS */
const languages = [
  { title: "HU", value: "hu" },
  { title: "EN", value: "en" }
]

// Fetch newsletter groups
const { data: groupsData , refresh: refreshGroups} = await useAsyncData(
  'newsletter-groups',
  () => $fetch('/api/newsletter/groups')
)
const groups = computed(() =>
  (groupsData.value?.groups || []).map(group => ({
    title: group.name,
    value: group.slug
  }))
)

/* FETCH SUBSCRIBERS */
const { data, pending, refresh } = await useAsyncData(
  "subscribers-list",
  () => fetchSubscribers()
)

const subscribers = computed(() => data.value?.subscribers || [])

/* TABLE HEADERS */
const headers = [
  { title: "Név", key: "firstname" },
  { title: "Email", key: "email" },
  { title: "Nyelv", key: "language" },
  { title: "Csoport", key: "groups" },
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
      !filterGroup.value ||
      s.groups?.includes(filterGroup.value)

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
    groups: ["ujjonc"],
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
  await refreshNuxtData("subscribers-list")
}

</script>
