<template>
  <v-container>
    <v-row class="mb-6" align="center">
      <v-col>
        <h1 class="text-h4">Ingyenes anyagok (Freebies)</h1>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" prepend-icon="mdi-plus" to="/admin/freebies/create">
          Új Freebie feltöltése
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="freebies"
        :loading="pending"
        class="elevation-1"
      >
        <template v-slot:item.slug="{ item }">
          <v-chip size="small" variant="outlined">/download/{{ item.slug }}</v-chip>
        </template>

        <template v-slot:item.downloadCount="{ item }">
          <span class="font-weight-bold text-primary">{{ item.downloadCount || 0 }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-delete"
            variant="text"
            color="red"
            size="small"
            @click="confirmDelete(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Törlés megerősítése</v-card-title>
        <v-card-text>Biztosan törölni szeretnéd a(z) "{{ selectedItem?.title }}" nevű anyagot?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Mégse</v-btn>
          <v-btn color="red" @click="deleteFreebie">Törlés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
// Admin ellenőrzés
definePageMeta({ middleware: 'auth' })

const freebies = ref([])
const pending = ref(true)
const deleteDialog = ref(false)
const selectedItem = ref(null)

// Használjuk a 'jwt' nevet, ami a feltöltésnél már bevált
const tokenCookie = useCookie('jwt')

const headers = [
  { title: 'Megnevezés', key: 'title', align: 'start' },
  { title: 'URL Slug', key: 'slug' },
  { title: 'Eredeti fájlnév', key: 'originalName' },
  { title: 'Letöltések', key: 'downloadCount', align: 'center' },
  { title: 'Műveletek', key: 'actions', sortable: false, align: 'end' },
]

// Lista betöltése
const loadFreebies = async () => {
  pending.value = true
  try {
    // FONTOS: Ne definiáld újra a $fetch-et! 
    // A Nuxt-ban a $fetch natívan elérhető globálisan.
    const data = await $fetch('/api/freebie/admin/list', {
      headers: { 
        Authorization: `Bearer ${tokenCookie.value}` 
      }
    })
    freebies.value = data
  } catch (e) {
    console.error('Hiba a listázáskor:', e)
  } finally {
    pending.value = false
  }
}

const confirmDelete = (item) => {
  selectedItem.value = item
  deleteDialog.value = true
}

const deleteFreebie = async () => {
  if (!selectedItem.value) return
  
  try {
    await $fetch(`/api/freebie/admin/${selectedItem.value._id}`, {
      method: 'DELETE',
      headers: { 
        Authorization: `Bearer ${tokenCookie.value}` 
      }
    })
    deleteDialog.value = false
    selectedItem.value = null
    await loadFreebies() 
  } catch (e) {
    console.error('Törlési hiba:', e)
    alert('Hiba történt a törlés során.')
  }
}

onMounted(() => {
  loadFreebies()
})
</script>