<template>
  <v-container>
    <v-row class="mb-6">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <div>
          <NuxtLink to="/admin/questionnaire" class="text-caption text-grey decoration-none">
            <v-icon size="x-small">mdi-arrow-left</v-icon> Vissza a listához
          </NuxtLink>
          <h1 class="text-h4 font-weight-bold">
            {{ isNew ? 'Új kérdőív' : 'Kérdőív szerkesztése' }}
          </h1>
        </div>
        <v-btn 
          color="success" 
          size="large" 
          prepend-icon="mdi-content-save" 
          :loading="saving"
          @click="saveQuestionnaire"
        >
          Mentés
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="pa-6 mb-6" variant="outlined" border>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="form.title" 
            label="Kérdőív címe" 
            placeholder="pl. Stressz-szint felmérés"
            @update:model-value="generateSlug"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field 
            v-model="form.slug" 
            label="URL azonosító (slug)" 
            prefix="/public/test/"
            hint="Ezen a linken lesz elérhető a kérdőív"
            persistent-hint
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-select v-model="form.language" :items="['hu', 'en', 'de']" label="Nyelv" />
        </v-col>
      </v-row>
      <v-textarea 
        v-model="form.description" 
        label="Bevezető szöveg / Kutatási cél" 
        rows="2" 
        class="mt-4"
        placeholder="Mondd el a kitöltőnek, miért fontos ez a teszt..."
      />
    </v-card>

    <h3 class="mb-4 d-flex align-center">
      <v-icon class="mr-2" color="primary">mdi-help-circle-outline</v-icon>
      Kérdések ({{ form.questions.length }})
    </h3>

    <v-expansion-panels v-model="activePanel" variant="accordion" class="mb-6">
      <v-expansion-panel v-for="(q, index) in form.questions" :key="index" border>
        <v-expansion-panel-title :class="{'text-error': !q.text}">
          <v-chip size="x-small" class="mr-3" color="primary" variant="flat">{{ index + 1 }}</v-chip>
          <span class="text-truncate">{{ q.text || 'Üres kérdés - Kérjük töltse ki!' }}</span>
          <v-spacer />
          <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click.stop="removeQuestion(index)" />
        </v-expansion-panel-title>
        
        <v-expansion-panel-text class="bg-grey-lighten-5 pa-4">
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field v-model="q.text" label="Kérdés szövege" hide-details />
            </v-col>
            <v-col cols="12" md="4">
              <v-select v-model="q.type" :items="questionTypes" label="Típus" hide-details />
            </v-col>
          </v-row>

          <div v-if="q.type !== 'text'" class="mt-6">
            <div class="d-flex justify-space-between align-center mb-2">
              <p class="text-caption font-weight-bold">Válaszlehetőségek és pontszámok:</p>
            </div>
            <v-row v-for="(opt, oIdx) in q.options" :key="oIdx" dense align="center" class="mb-1">
              <v-col cols="8">
                <v-text-field v-model="opt.label" label="Válasz" density="compact" hide-details />
              </v-col>
              <v-col cols="2">
                <v-text-field v-model.number="opt.points" type="number" label="Pont" density="compact" hide-details />
              </v-col>
              <v-col cols="2" class="d-flex justify-center">
                <v-btn icon="mdi-close" variant="text" color="grey" size="small" @click="removeOption(index, oIdx)" />
              </v-col>
            </v-row>
            <v-btn variant="text" color="primary" size="small" prepend-icon="mdi-plus" class="mt-2" @click="addOption(index)">
              Opció hozzáadása
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-btn block variant="outlined" color="primary" class="mt-4 py-8 border-dashed" prepend-icon="mdi-plus" @click="addQuestion">
      Új kérdés hozzáadása
    </v-btn>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.params.id === 'new');
const saving = ref(false);
const activePanel = ref(0);
const snackbar = ref({ show: false, text: '', color: '' });

const questionTypes = [
  { title: 'Egyválasztós (Rádió)', value: 'radio' },
  { title: 'Többválasztós (Checkbox)', value: 'checkbox' },
  { title: 'Skála (1-5)', value: 'scale' },
  { title: 'Szöveges kifejtős', value: 'text' }
];

const form = ref({
  title: '',
  slug: '',
  language: 'hu',
  description: '',
  questions: []
});

// Adatok betöltése a Proxy végponton keresztül
onMounted(async () => {
  if (!isNew.value) {
    try {
      // Az összes kérdőívet lekérjük a proxy-n keresztül, majd kikeressük a megfelelőt
      const data = await $fetch('/api/questionnaire/admin/list');
      const current = data.find(q => q._id === route.params.id);
      if (current) {
        form.value = current;
      } else {
        showMsg('A kérdőív nem található', 'error');
      }
    } catch (err) {
      showMsg('Hiba az adatok betöltésekor', 'error');
    }
  }
});

const generateSlug = () => {
  if (isNew.value) {
    form.value.slug = form.value.title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Ékezetek eltávolítása
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
};

const addQuestion = () => {
  form.value.questions.push({
    id: 'q_' + Date.now(),
    text: '',
    type: 'radio',
    options: [{ label: '', points: 0 }],
    required: true
  });
  activePanel.value = form.value.questions.length - 1;
};

const removeQuestion = (idx) => {
  if (confirm('Biztosan törlöd ezt a kérdést?')) {
    form.value.questions.splice(idx, 1);
  }
};

const addOption = (qIdx) => {
  form.value.questions[qIdx].options.push({ label: '', points: 0 });
};

const removeOption = (qIdx, oIdx) => {
  if (form.value.questions[qIdx].options.length > 1) {
    form.value.questions[qIdx].options.splice(oIdx, 1);
  }
};

const showMsg = (text, color = 'success') => {
  snackbar.value = { show: true, text, color };
};

const saveQuestionnaire = async () => {
  if (!form.value.title || !form.value.slug) {
    return showMsg('Cím és URL azonosító kötelező!', 'warning');
  }

  saving.value = true;
  try {
    const response = await $fetch('/api/questionnaire/save', {
      method: 'POST',
      body: form.value
    });

    if (response.ok) {
      showMsg('Kérdőív sikeresen elmentve!');
      // Kis késleltetés, hogy látszódjon a siker üzenet
      setTimeout(() => router.push('/admin/questionnaire'), 1500);
    }
  } catch (err) {
    showMsg('Szerver hiba a mentés során', 'error');
  } finally {
    saving.value = false;
  }
};

definePageMeta({
  middleware: 'auth'
});
</script>

<style scoped>
.border-dashed {
  border: 2px dashed currentColor !important;
}
</style>