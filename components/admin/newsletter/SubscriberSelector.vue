<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="900px"
  >
    <v-card rounded="lg">

      <!-- TITLE -->
      <v-card-title class="text-h6 font-bold">
        Címzettek kiválasztása
      </v-card-title>

      <v-divider />

      <v-card-text>

        <!-- FILTERS -->
        <v-row class="mb-4" dense>
          <v-col cols="12" md="4">
            <v-select
              label="Nyelv"
              :items="languages"
              v-model="filterLanguage"
              clearable
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              label="Csoport"
              :items="groups"
              v-model="filterGroup"
              clearable
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="Keresés név vagy email alapján"
              v-model="search"
              prepend-icon="mdi-magnify"
              clearable
            />
          </v-col>
        </v-row>

        <!-- ACTION BUTTONS -->
        <div class="flex gap-4 mb-4">
          <v-btn variant="tonal" @click="selectAll">Mind kijelölése</v-btn>
          <v-btn variant="tonal" @click="selectNone">Kijelölés törlése</v-btn>
        </div>

        <!-- SUBSCRIBER TABLE -->
        <v-data-table
          :headers="headers"
          :items="pagedSubscribers"
          :items-per-page="itemsPerPage"
          :page.sync="page"
          item-key="email"
          show-select
          v-model:selected="selectedEmails"
        >
          <template #item.name="{ item }">
            {{ item.firstname }} {{ item.name }}
          </template>
        </v-data-table>

      </v-card-text>

      <v-divider />

      <!-- FOOTER -->
      <v-card-actions>
        <div class="text-grey-darken-1">
          Kiválasztott címzettek: <strong>{{ selectedEmails.length }}</strong>
        </div>

        <v-spacer />

        <v-btn variant="text" @click="$emit('update:modelValue', false)">
          Mégse
        </v-btn>

        <v-btn color="primary" @click="save">
          Mentés
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>
/* PROPS */
const props = defineProps({
  modelValue: Boolean,
  selected: Array // email címek listája
})

const emit = defineEmits(['update:modelValue', 'update:selected'])

/* STATE */
const subscribers = ref([]) // teljes subscriber lista backendből
const selectedEmails = ref([...props.selected])

const search = ref("")
const filterLanguage = ref(null)
const filterGroup = ref(null)

const page = ref(1)
const itemsPerPage = 10

/* TABLE HEADERS */
const headers = [
  { title: "Név", key: "name" },
  { title: "Email", key: "email" },
  { title: "Csoport", key: "group" },
  { title: "Nyelv", key: "language" }
]

/* FILTER OPTIONS */
const languages = ["hu", "en", "de"]
const groups = ["ujjonc", "vip", "coaching"]

/* LOAD SUBSCRIBERS FROM BACKEND */
onMounted(async () => {
  const res = await $fetch('/api/newsletter/subscribers', { method: 'POST' })
  subscribers.value = res.subscribers || []
})

/* FILTERED LIST */
const filteredSubscribers = computed(() => {
  let list = [...subscribers.value]

  if (filterLanguage.value) {
    list = list.filter(s => s.language === filterLanguage.value)
  }

  if (filterGroup.value) {
    list = list.filter(s => s.group === filterGroup.value)
  }

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(s =>
      s.firstname.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    )
  }

  return list
})

/* PAGINATION */
const pagedSubscribers = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return filteredSubscribers.value.slice(start, start + itemsPerPage)
})

/* ACTIONS */
function selectAll() {
  selectedEmails.value = filteredSubscribers.value.map(s => s.email)
}

function selectNone() {
  selectedEmails.value = []
}

function save() {
  emit('update:selected', selectedEmails.value)
  emit('update:modelValue', false)
}
</script>

<style scoped>
</style>
