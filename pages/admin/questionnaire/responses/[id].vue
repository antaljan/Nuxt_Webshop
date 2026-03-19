<template>
  <v-container>
    <v-row class="mb-6" align="center">
      <v-col>
        <NuxtLink to="/admin/questionnaire" class="text-caption text-grey decoration-none">
          <v-icon size="x-small">mdi-arrow-left</v-icon> Vissza a kérdőívekhez
        </NuxtLink>
        <h1 class="text-h4 font-weight-bold mt-2">Kitöltések és Eredmények</h1>
        <p class="text-subtitle-1 text-primary">{{ questionnaire?.title }}</p>
      </v-col>
      <v-col cols="auto">
        <v-btn 
          prepend-icon="mdi-download" 
          variant="outlined" 
          color="secondary" 
          @click="exportToCSV"
          :disabled="!responses.length"
        >
          CSV Export
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card border variant="flat" class="pa-4 rounded-xl text-center">
          <div class="text-overline">Összes kitöltés</div>
          <div class="text-h4 font-weight-bold">{{ responses.length }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card border variant="flat" class="pa-4 rounded-xl text-center">
          <div class="text-overline">Átlag pontszám</div>
          <div class="text-h4 font-weight-bold text-primary">{{ averageScore }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card border class="rounded-xl">
      <v-toolbar color="white" border="bottom">
        <v-toolbar-title class="text-subtitle-1 font-weight-bold">
          Egyéni válaszok
        </v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Keresés..."
          single-line
          hide-details
          density="compact"
          class="mr-4"
          style="max-width: 300px"
        />
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="responses"
        :search="search"
        :loading="pending"
        hover
      >
        <template v-slot:item.submittedAt="{ item }">
          <span class="text-caption">
            {{ new Date(item.submittedAt).toLocaleString('hu-HU') }}
          </span>
        </template>

        <template v-slot:item.totalScore="{ item }">
          <v-chip :color="getScoreColor(item.totalScore)" size="small" variant="flat">
            {{ item.totalScore }} pont
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-information-outline"
            variant="text"
            size="small"
            color="primary"
            @click="showDetails(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="detailsDialog" max-width="700">
      <v-card v-if="selectedResponse" class="rounded-xl pa-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Kitöltés részletei</span>
          <v-btn icon="mdi-close" variant="text" @click="detailsDialog = false"></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <div class="mb-4 text-caption text-grey">
            ID: {{ selectedResponse._id }} | Időpont: {{ new Date(selectedResponse.submittedAt).toLocaleString() }}
          </div>
          
          <div v-for="(ans, idx) in selectedResponse.answers" :key="idx" class="mb-6">
            <div class="font-weight-bold text-body-2 mb-1">{{ idx + 1 }}. {{ getQuestionText(ans.questionId) }}</div>
            <v-alert
              variant="tonal"
              :color="ans.points > 0 ? 'primary' : 'grey'"
              density="compact"
              border="start"
            >
              {{ ans.value }} <span v-if="ans.points" class="ml-2 text-caption">({{ ans.points }} pont)</span>
            </v-alert>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
const route = useRoute();
const search = ref('');
const detailsDialog = ref(false);
const selectedResponse = ref(null);

const headers = [
  { title: 'Dátum', key: 'submittedAt', sortable: true },
  { title: 'Felhasználó', key: 'userId', align: 'center' }, // Itt lehetne név is, ha be van jelentkezve
  { title: 'Összpontszám', key: 'totalScore', align: 'center', sortable: true },
  { title: 'Részletek', key: 'actions', align: 'end', sortable: false },
];

// Adatok betöltése
const { data: responses, pending } = await useAsyncData(`responses-${route.params.id}`, () =>
  $fetch(`/api/questionnaire/admin/responses/${route.params.id}`)
);

const { data: questionnaire } = await useAsyncData(`q-detail-${route.params.id}`, () =>
  $fetch(`/api/questionnaire/admin/list`).then(list => list.find(q => q._id === route.params.id))
);

// Számított értékek
const averageScore = computed(() => {
  if (!responses.value?.length) return 0;
  const sum = responses.value.reduce((acc, r) => acc + (r.totalScore || 0), 0);
  return (sum / responses.value.length).toFixed(1);
});

// Segédfüggvények
const getScoreColor = (score) => {
  if (score > 15) return 'error';
  if (score > 8) return 'warning';
  return 'success';
};

const showDetails = (item) => {
  selectedResponse.value = item;
  detailsDialog.value = true;
};

const getQuestionText = (qId) => {
  const q = questionnaire.value?.questions.find(q => q.id === qId);
  return q ? q.text : 'Ismeretlen kérdés';
};

const exportToCSV = () => {
  // Gyors CSV generálás kutatási célra
  const rows = responses.value.map(r => ({
    date: new Date(r.submittedAt).toISOString(),
    score: r.totalScore,
    // Itt a válaszokat is ki lehetne bontani oszlopokba
  }));
  console.log("CSV export indítása...", rows);
  alert("CSV Export funkció előkészítve (kutatáshoz ideális)");
};

definePageMeta({ middleware: 'auth' });
</script>