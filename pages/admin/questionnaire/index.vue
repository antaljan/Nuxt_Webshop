<template>
  <v-container>
    <v-row class="mb-6" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Kérdőívek és Kutatások</h1>
        <p class="text-subtitle-1 text-grey">Kezeld a klienseidnek szánt felméréseket és kutatásokat</p>
      </v-col>
      <v-col cols="auto">
        <v-btn 
          color="primary" 
          prepend-icon="mdi-plus" 
          size="large" 
          to="/admin/questionnaire/edit/new"
          elevation="2"
        >
          Új kérdőív
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card border variant="flat" class="pa-4 rounded-xl">
          <div class="text-overline mb-1">Összes kérdőív</div>
          <div class="text-h4 font-weight-bold">{{ questionnaires?.length || 0 }} db</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card border class="rounded-xl overflow-hidden">
      <v-data-table
        :headers="headers"
        :items="questionnaires"
        :loading="pending"
        hover
        no-data-text="Még nincs létrehozott kérdőív"
        loading-text="Kérdőívek betöltése..."
      >
        <template v-slot:item.language="{ item }">
          <v-chip size="x-small" variant="tonal" class="text-uppercase font-weight-bold">
            {{ item.language }}
          </v-chip>
        </template>

        <template v-slot:item.isActive="{ item }">
          <div class="d-flex align-center">
            <v-badge
              :color="item.isActive !== false ? 'success' : 'grey'"
              dot
              inline
              class="mr-2"
            ></v-badge>
            <span class="text-caption">{{ item.isActive !== false ? 'Aktív' : 'Inaktív' }}</span>
          </div>
        </template>

        <template v-slot:item.createdAt="{ item }">
          <span class="text-caption text-grey">
            {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString('hu-HU') : '-' }}
          </span>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              icon="mdi-chart-bar"
              variant="text"
              color="secondary"
              size="small"
              class="mr-1"
              :to="`/admin/questionnaire/responses/${item._id}`"
              title="Válaszok megtekintése"
            ></v-btn>

            <v-btn
              icon="mdi-open-in-new"
              variant="text"
              color="info"
              size="small"
              class="mr-1"
              :href="`/public/test/${item.slug}`"
              target="_blank"
              title="Publikus oldal"
            ></v-btn>

            <v-btn
              icon="mdi-pencil"
              variant="text"
              color="primary"
              size="small"
              class="mr-1"
              :to="`/admin/questionnaire/edit/${item._id}`"
              title="Szerkesztés"
            ></v-btn>

            <v-btn
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              @click="confirmDelete(item)"
              title="Törlés"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="450">
      <v-card class="pa-4 rounded-xl">
        <v-card-title class="text-h5">Törlés megerősítése</v-card-title>
        <v-card-text>
          Biztosan törölni szeretnéd a(z) <br><strong>{{ selectedItem?.title }}</strong> kérdőívet? 
          <p class="text-error mt-2 text-caption italic">Ez a művelet nem vonható vissza!</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" rounded="xl" @click="deleteDialog = false">Mégse</v-btn>
          <v-btn color="error" variant="flat" rounded="xl" class="px-6" @click="handleDelete">Törlés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
const headers = [
  { title: 'Megnevezés', key: 'title', align: 'start', sortable: true },
  { title: 'Nyelv', key: 'language', align: 'center', width: '80px' },
  { title: 'Kérdések', key: 'questions.length', align: 'center', width: '100px' },
  { title: 'Állapot', key: 'isActive', align: 'center', width: '120px' },
  { title: 'Létrehozva', key: 'createdAt', align: 'center', width: '120px' },
  { title: 'Műveletek', key: 'actions', align: 'end', sortable: false },
];

const deleteDialog = ref(false);
const selectedItem = ref(null);

// Adatok betöltése az új proxy végponton keresztül
const { data: questionnaires, pending, refresh } = await useAsyncData(
  'admin-questionnaires',
  () => $fetch('/api/questionnaire/admin/list'),
  { default: () => [] }
);

const confirmDelete = (item) => {
  selectedItem.value = item;
  deleteDialog.value = true;
};

const handleDelete = async () => {
  if (!selectedItem.value) return;
  
  try {
    // Az új dinamikus proxy végpont hívása
    await $fetch(`/api/questionnaire/admin/delete/${selectedItem.value._id}`, {
      method: 'DELETE'
    });
    
    deleteDialog.value = false;
    refresh();
  } catch (err) {
    console.error('Törlési hiba:', err);
    alert('Hiba történt a törlés során.');
  }
};

definePageMeta({
  middleware: 'auth'
});
</script>