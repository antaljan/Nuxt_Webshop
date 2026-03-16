<template>
  <v-container>
    <v-row class="mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Visszajelzések kezelése</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">Új visszajelzés</v-btn>
      </v-col>
    </v-row>

    <!-- Statisztikai gyorsnézet -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card subtitle="Összesen" :title="feedbacks.length.toString()" variant="tonal" color="primary"></v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card subtitle="Publikált" :title="feedbacks.filter(f => f.status === 'published').length.toString()" variant="tonal" color="success"></v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card subtitle="Átlag értékelés" :title="averageRating" variant="tonal" color="warning"></v-card>
      </v-col>
    </v-row>

    <!-- Lista -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="feedbacks"
        :loading="pending"
        hover
      >
        <template #[`item.rating`]="{ item }">
          <v-rating :model-value="item.rating" readonly density="compact" color="amber" size="small"></v-rating>
        </template>
        
        <template #[`item.status`]="{ item }">
          <v-chip :color="item.status === 'published' ? 'success' : 'grey'" size="small">
            {{ item.status === 'published' ? 'Publikus' : 'Vázlat' }}
          </v-chip>
        </template>

        <template #[`item.language`]="{ item }">
          <v-chip variant="outlined" size="x-small">{{ item.language.toUpperCase() }}</v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="blue" @click="openDialog(item)"></v-btn>
          <v-btn icon="mdi-delete" variant="text" color="error" @click="deleteFeedback(item._id)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Edit/Create Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>{{ editedItem._id ? 'Szerkesztés' : 'Új visszajelzés' }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-row class="gap-4">
              <v-text-field v-model="editedItem.name" label="Név" required></v-text-field>
              <v-select v-model="editedItem.language" :items="['hu', 'de', 'en']" label="Nyelv"></v-select>
            </v-text-row>
            
            <v-select v-model="editedItem.source" :items="['Facebook', 'Google', 'Email', 'Webpage']" label="Forrás"></v-select>
            
            <v-textarea v-model="editedItem.content" label="Tartalom (HTML)" rows="4"></v-textarea>
            
            <div class="d-flex align-center mb-4">
              <span class="mr-2">Értékelés:</span>
              <v-rating v-model="editedItem.rating" color="amber"></v-rating>
            </div>

            <v-switch v-model="editedItem.status" true-value="published" false-value="draft" :label="`Státusz: ${editedItem.status}`" color="primary"></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Mégse</v-btn>
          <v-btn color="primary" :loading="saving" @click="save">Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const { data: feedbacks, refresh, pending } = await useFetch('/api/feedbacks')
const dialog = ref(false)
const saving = ref(false)

const headers = [
  { title: 'Név', key: 'name' },
  { title: 'Nyelv', key: 'language' },
  { title: 'Értékelés', key: 'rating' },
  { title: 'Forrás', key: 'source' },
  { title: 'Státusz', key: 'status' },
  { title: 'Műveletek', key: 'actions', sortable: false },
]

const defaultItem = {
  name: '',
  content: '',
  language: 'hu',
  rating: 5,
  status: 'published',
  source: 'Facebook'
}

const editedItem = ref({ ...defaultItem })

const averageRating = computed(() => {
  if (!feedbacks.value?.length) return '0'
  const sum = feedbacks.value.reduce((acc, curr) => acc + curr.rating, 0)
  return (sum / feedbacks.value.length).toFixed(1)
})

const openDialog = (item = null) => {
  editedItem.value = item ? { ...item } : { ...defaultItem }
  dialog.value = true
}

const save = async () => {
  saving.value = true
  const isEdit = !!editedItem.value._id
  const url = isEdit ? `/api/feedbacks/${editedItem.value._id}` : '/api/feedbacks/new'
  const method = isEdit ? 'PUT' : 'POST'

  try {
    await $fetch(url, {
      method,
      body: editedItem.value
    })
    await refresh()
    dialog.value = false
  } catch (e) {
    console.error('Mentési hiba:', e)
  } finally {
    saving.value = false
  }
}

const deleteFeedback = async (id) => {
  if (!confirm('Biztosan törlöd ezt a visszajelzést?')) return
  try {
    await $fetch(`/api/feedbacks/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    console.error('Törlési hiba:', e)
  }
}
</script>
