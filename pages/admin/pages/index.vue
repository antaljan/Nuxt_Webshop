<template>
  <section class="p-6 space-y-6">

    <!-- BACK BUTTON -->
    <v-btn
      color="primary"
      variant="text"
      prepend-icon="mdi-arrow-left"
      to="/admin"
    >
      Vissza az admin felületre
    </v-btn>

    <!-- HEADER -->
    <div class="flex justify-between items-center">

      <h1 class="text-2xl font-bold">
        Oldalak kezelése
      </h1>

      <v-btn
        color="success"
        prepend-icon="mdi-file-plus"
        @click="createDialog = true"
      >
        Új oldal
      </v-btn>

    </div>

    <!-- SEARCH -->
    <v-card class="pa-4">
      <v-text-field
        v-model="search"
        label="Keresés név vagy slug alapján"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        clearable
      />
    </v-card>

    <!-- TABLE -->
    <v-card>

      <v-data-table
        :headers="headers"
        :items="filteredPages"
        :loading="pending"
        items-per-page="10"
      >

        <!-- PAGE NAME -->
        <template #item.name="{ item }">

          <div class="font-medium">
            {{ item.name }}
          </div>

        </template>

        <!-- PAGE TYPE -->
        <template #item.pageType="{ item }">

          <v-chip
            :color="getPageTypeColor(item.pageType)"
            size="small"
          >
            {{ item.pageType }}
          </v-chip>

        </template>

        <!-- ACTIONS -->
        <template #item.actions="{ item }">

          <v-btn
            icon="mdi-open-in-new"
            variant="text"
            color="primary"
            @click="openPage(item)"
          />

          <v-btn
            icon="mdi-content-copy"
            variant="text"
            color="info"
            @click="copyLink(item)"
          />       

          <v-btn
            icon="mdi-delete"
            variant="text"
            color="error"
            @click="confirmDelete(item)"
          />

        </template>

      </v-data-table>

    </v-card>

    <!-- NEW PAGE DIALOG -->
    <v-dialog
      v-model="createDialog"
      max-width="700"
    >
      <v-card>

        <v-card-title>
          Új oldal létrehozása
        </v-card-title>

        <v-card-text class="space-y-4">

          <v-text-field
            v-model="newPage.name"
            label="Oldal neve"
            variant="outlined"
          />

          <v-text-field
            v-model="newPage.slug"
            label="Slug"
            variant="outlined"
            hint="Például: /about vagy /services"
            persistent-hint
          />

          <v-select
            v-model="newPage.pageType"
            label="Oldal típusa"
            variant="outlined"
            :items="pageTypes"
          />

        </v-card-text>

        <v-card-actions>

          <v-spacer />

          <v-btn
            variant="text"
            @click="createDialog = false"
          >
            Mégse
          </v-btn>

          <v-btn
            color="success"
            :loading="saving"
            @click="createPage"
          >
            Létrehozás
          </v-btn>

        </v-card-actions>

      </v-card>
    </v-dialog>

  </section>
</template>

<script setup>

const router = useRouter()

const search = ref('')
const createDialog = ref(false)
const saving = ref(false)

const pageTypes = [
  'homepage',
  'page',
  'service',
  'landing',
  'leadmagnet'
]

const newPage = ref({
  name: '',
  slug: '',
  pageType: 'page'
})

const headers = [
  {
    title: 'Név',
    key: 'name'
  },
  {
    title: 'Slug',
    key: 'slug'
  },
  {
    title: 'Típus',
    key: 'pageType'
  },
  {
    title: 'Műveletek',
    key: 'actions',
    sortable: false
  }
]

const { data, pending, refresh } = await useAsyncData(
  'admin-pages',
  () => $fetch('/api/page/admin/all')
)

const pages = computed(
  () => data.value?.items || []
)

const filteredPages = computed(() => {

  if (!search.value) {
    return pages.value
  }

  const term = search.value.toLowerCase()

  return pages.value.filter(page => {

    return (
      page.name?.toLowerCase().includes(term) ||
      page.slug?.toLowerCase().includes(term)
    )

  })

})

async function createPage() {

  try {

    saving.value = true

    await $fetch('/api/page/create', {
      method: 'POST',
      body: {
        name: newPage.value.name,
        slug: normalizeSlug(newPage.value.slug),
        pageType: newPage.value.pageType,

        seo: {
          hu: {
            title: '',
            description: ''
          },
          en: {
            title: '',
            description: ''
          },
          de: {
            title: '',
            description: ''
          }
        },

        sections: []
      }
    })

    createDialog.value = false

    await refresh()

    router.push('/' + normalizeSlug(newPage.value.slug))

  } catch (err) {

    console.error(err)

    alert('Nem sikerült létrehozni az oldalt.')

  } finally {

    saving.value = false

  }

}

function openPage(page) {
  router.push('/' + page.slug)
}

async function confirmDelete(page) {

  if (
    !confirm(
      `Biztosan törlöd ezt az oldalt?\n\n${page.name}`
    )
  ) {
    return
  }

  try {

    await $fetch(
      `/api/page/admin/${page._id}`,
      {
        method: 'DELETE'
      }
    )

    await refresh()

  } catch (err) {

    console.error(err)

    alert('A törlés sikertelen.')

  }

}

function normalizeSlug(slug) {
  return slug
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
}

async function copyLink(page) {

  const url =
    `${window.location.origin}/${page.slug}`

  await navigator.clipboard.writeText(
    url
  )

  alert(
    'Link a vágólapra másolva.'
  )

}

function getPageTypeColor(
  type
) {

  switch (type) {

    case 'leadmagnet':
      return 'success'

    case 'homepage':
      return 'warning'

    case 'service':
      return 'info'

    default:
      return 'primary'

  }

}

</script>
