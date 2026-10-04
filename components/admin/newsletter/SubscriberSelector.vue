<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="900px"
  >
    <v-card rounded="lg">

      <v-card-title class="text-h6 font-bold">
        Címzettek kiválasztása
      </v-card-title>

      <v-divider />

      <v-card-text>

        <!-- FILTERS -->

        <v-row class="mb-4" dense>

          <v-col cols="12" md="4">
            <v-select
              v-model="filterLanguage"
              :items="languages"
              label="Nyelv"
              clearable
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="filterGroup"
              :items="groups"
              item-title="title"
              item-value="value"
              label="Csoport"
              clearable
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Keresés név vagy email alapján"
              prepend-icon="mdi-magnify"
              clearable
            />
          </v-col>

        </v-row>

        <!-- ACTION BUTTONS -->

        <div class="flex gap-4 mb-4">
          <v-btn
            variant="tonal"
            @click="selectAll"
          >
            Mind kijelölése
          </v-btn>

          <v-btn
            variant="tonal"
            @click="selectNone"
          >
            Kijelölés törlése
          </v-btn>
        </div>

        <!-- TABLE -->

        <v-data-table
          :headers="headers"
          :items="pagedSubscribers"
          :items-per-page="itemsPerPage"
          v-model:page="page"
          item-key="email"
        >

          <template #item.selected="{ item }">
            <v-checkbox
              v-model="item.selected"
              density="compact"
              hide-details
            />
          </template>

          <template #item.name="{ item }">
            {{ item.firstname }} {{ item.name }}
          </template>

          <template #item.groups="{ item }">
            <div class="flex flex-wrap gap-1">

              <v-chip
                v-for="group in item.groups"
                :key="group"
                size="x-small"
              >
                {{
                  groupMap[group]?.name || group
                }}
              </v-chip>

            </div>
          </template>

        </v-data-table>

      </v-card-text>

      <v-divider />

      <v-card-actions>

        <div class="text-grey-darken-1">
          Kiválasztott címzettek:
          <strong>{{ selectedCount }}</strong>
        </div>

        <v-spacer />

        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Mégse
        </v-btn>

        <v-btn
          color="primary"
          @click="save"
        >
          Mentés
        </v-btn>

      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>

const props = defineProps({
  modelValue: Boolean,

  selected: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:modelValue',
  'update:selected'
])

/* DATA */

const subscribers = ref([])
const selectorList = ref([])

const search = ref("")
const filterLanguage = ref(null)
const filterGroup = ref(null)

const page = ref(1)
const itemsPerPage = 10

/* GROUPS */

const { data: groupsData } = await useAsyncData(
  'subscriber-selector-groups',
  () => $fetch('/api/newsletter/groups')
)

const groups = computed(() =>
  [...(groupsData.value?.groups || [])]
    .sort((a, b) => a.order - b.order)
    .map(group => ({
      title: group.name,
      value: group.slug
    }))
)

const groupMap = computed(() => {

  const map = {}

  for (const group of groupsData.value?.groups || []) {
    map[group.slug] = group
  }

  return map
})

/* TABLE */

const headers = [
  {
    title: "",
    key: "selected",
    width: 60
  },
  {
    title: "Név",
    key: "name"
  },
  {
    title: "Email",
    key: "email"
  },
  {
    title: "Csoportok",
    key: "groups"
  },
  {
    title: "Nyelv",
    key: "language"
  }
]

/* FILTERS */

const languages = [
  "hu",
  "en",
  "de"
]

/* LOAD SUBSCRIBERS */

onMounted(async () => {

  const res = await $fetch(
    '/api/newsletter/subscribers'
  )

  subscribers.value =
    res.subscribers || []

  selectorList.value =
    subscribers.value.map(s => ({
      ...s,
      selected:
        props.selected.includes(s.email)
    }))

})

/* FILTERED */

const filteredSubscribers = computed(() => {

  let list = [...selectorList.value]

  if (filterLanguage.value) {
    list = list.filter(
      s => s.language === filterLanguage.value
    )
  }

  if (filterGroup.value) {
    list = list.filter(
      s => s.groups?.includes(filterGroup.value)
    )
  }

  if (search.value) {

    const q =
      search.value.toLowerCase()

    list = list.filter(s =>
      (s.firstname || '')
        .toLowerCase()
        .includes(q) ||

      (s.name || '')
        .toLowerCase()
        .includes(q) ||

      (s.email || '')
        .toLowerCase()
        .includes(q)
    )
  }

  return list
})

/* PAGINATION */

const pagedSubscribers = computed(() => {

  const start =
    (page.value - 1) * itemsPerPage

  return filteredSubscribers.value.slice(
    start,
    start + itemsPerPage
  )

})

/* COUNTER */

const selectedCount = computed(() =>
  selectorList.value.filter(
    s => s.selected
  ).length
)

/* ACTIONS */

function selectAll() {

  filteredSubscribers.value.forEach(
    s => {
      s.selected = true
    }
  )

}

function selectNone() {

  filteredSubscribers.value.forEach(
    s => {
      s.selected = false
    }
  )

}

function save() {

  const emails =
    selectorList.value
      .filter(s => s.selected)
      .map(s => s.email)

  emit('update:selected', emails)

  emit(
    'update:modelValue',
    false
  )

}

</script>