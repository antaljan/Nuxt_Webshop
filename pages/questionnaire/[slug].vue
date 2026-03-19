<template>
  <v-container class="fill-height justify-center">
    <v-responsive max-width="800">
      
      <v-card v-if="pending" flat class="text-center pa-12">
        <v-progress-circular indeterminate color="primary" size="64" />
        <div class="mt-4 text-grey">Kérdőív betöltése...</div>
      </v-card>

      <v-card v-else-if="error || !questionnaire" flat class="text-center pa-12">
        <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
        <h2 class="mt-4">Sajnáljuk, a kérdőív nem található.</h2>
        <v-btn to="/" class="mt-6" variant="text">Vissza a főoldalra</v-btn>
      </v-card>

      <template v-else>
        <v-card v-if="step === 'intro'" border class="rounded-xl pa-6 pa-md-10 shadow-lg">
          <v-chip size="small" color="primary" variant="tonal" class="mb-4 text-uppercase">
            {{ questionnaire.language }} felmérés
          </v-chip>
          <h1 class="text-h3 font-weight-bold mb-4">{{ questionnaire.title }}</h1>
          <p class="text-body-1 text-grey-darken-1 mb-8" style="line-height: 1.8;">
            {{ questionnaire.description || 'Kérjük, válaszolj őszintén a következő kérdésekre a pontos kiértékelés érdekében.' }}
          </p>
          <v-btn 
            block 
            color="primary" 
            size="x-large" 
            rounded="xl" 
            @click="startTest"
          >
            Teszt indítása
          </v-btn>
        </v-card>

        <v-card v-else-if="step === 'questions'" border class="rounded-xl pa-6 pa-md-10 overflow-hidden">
          <v-progress-linear
            :model-value="progress"
            color="primary"
            height="8"
            rounded
            class="mb-8"
          />

          <div class="d-flex justify-space-between align-center mb-6">
            <span class="text-overline">Kérdés: {{ currentIdx + 1 }} / {{ questionnaire.questions.length }}</span>
          </div>

          <v-window v-model="currentIdx">
            <v-window-item v-for="(q, idx) in questionnaire.questions" :key="idx">
              <h2 class="text-h5 font-weight-bold mb-6">{{ q.text }}</h2>
              <!-- radio button -->
              <v-radio-group v-if="q.type === 'radio'" v-model="answers[q.id]">
                <v-card
                  v-for="opt in q.options"
                  :key="opt.label"
                  :variant="answers[q.id] === opt.label ? 'tonal' : 'outlined'"
                  :color="answers[q.id] === opt.label ? 'primary' : 'grey-lighten-2'"
                  class="mb-3 pa-1 rounded-lg transition-swing"
                  @click="answers[q.id] = opt.label"
                >
                  <v-radio :label="opt.label" :value="opt.label" class="ma-2" />
                </v-card>
              </v-radio-group>
              <!-- lickert -->
              <div v-if="q.type === 'scale'" class="my-8">
                <v-slider
                  v-model="answers[q.id]"
                  :min="1"
                  :max="q.options.length"
                  :step="1"
                  color="primary"
                  track-color="grey-lighten-2"
                  thumb-size="28"
                  show-ticks="always"
                  tick-size="4"
                />
                <v-row class="justify-space-between mt-2">
                  <v-col
                    v-for="(opt, idx) in q.options"
                    :key="idx"
                    class="text-center text-caption"
                  >
                    {{ opt.label }}
                  </v-col>
                </v-row>
              </div>
              <!-- checkbox -->
              <div v-if="q.type === 'checkbox'">
                <v-checkbox
                  v-for="opt in q.options"
                  :key="opt.label"
                  v-model="answers[q.id]"
                  :label="opt.label"
                  :value="opt.label"
                />
              </div>
              <!-- Text -->
              <v-textarea
                v-else-if="q.type === 'text'"
                v-model="answers[q.id]"
                label="Írd ide a válaszod..."
                variant="outlined"
                rows="4"
              />
            </v-window-item>
          </v-window>

          <div class="d-flex justify-space-between mt-10">
            <v-btn 
              variant="text" 
              prepend-icon="mdi-arrow-left" 
              @click="prevQuestion" 
              :disabled="currentIdx === 0"
            >
              Vissza
            </v-btn>
            
            <v-btn 
              v-if="currentIdx < questionnaire.questions.length - 1"
              color="primary" 
              append-icon="mdi-arrow-right" 
              size="large"
              :disabled="!isCurrentAnswered"
              @click="nextQuestion"
            >
              Következő
            </v-btn>

            <v-btn 
              v-else
              color="success" 
              size="large"
              :loading="submitting"
              :disabled="!isCurrentAnswered"
              @click="submitTest"
            >
              Kiértékelés befejezése
            </v-btn>
          </div>
        </v-card>

        <v-card v-else-if="step === 'result'" border class="rounded-xl pa-10 text-center shadow-lg">
          <v-icon size="80" color="success" class="mb-4">mdi-check-decagram</v-icon>
          <h2 class="text-h4 font-weight-bold mb-2">Köszönjük a kitöltést!</h2>
          <p class="text-body-1 mb-6 text-grey">A válaszaidat rögzítettük.</p>
          
          <v-divider class="mb-6" />
          
          <div class="text-h5 mb-4">Elért pontszám: <strong>{{ totalScore }}</strong></div>
          
          <v-alert
            color="blue-lighten-5"
            icon="mdi-information"
            class="text-left mb-8 rounded-lg"
          >
            Hamarosan jelentkezünk a részletes elemzéssel. Ha azonnali segítségre van szükséged, csatlakozz a Jitsi szobához a megbeszélt időpontban.
          </v-alert>

          <v-btn color="primary" size="large" to="/" rounded="xl">Vissza a főoldalra</v-btn>
        </v-card>
      </template>

    </v-responsive>
  </v-container>
</template>

<script setup>
const route = useRoute();
const step = ref('intro'); // intro, questions, result
const currentIdx = ref(0);
const answers = ref({});
const submitting = ref(false);
const totalScore = ref(0);

// Adatok betöltése a Proxy-n keresztül
const { data: questionnaire, pending, error } = await useAsyncData(
  `public-q-${route.params.slug}`,
  () => $fetch(`/api/questionnaire/public/${route.params.slug}`)
);

// Itt inicializáljuk, NEM watch-ban
if (questionnaire.value) {
  questionnaire.value.questions.forEach(q => {
    if (q.type === 'checkbox') {
      answers.value[q.id] = [];
    }
  });
}

const progress = computed(() => {
  if (!questionnaire.value) return 0;
  return ((currentIdx.value + 1) / questionnaire.value.questions.length) * 100;
});

const isCurrentAnswered = computed(() => {
  const currentQ = questionnaire.value?.questions[currentIdx.value];
  if (!currentQ) return false;

  const val = answers.value[currentQ.id];

  if (currentQ.type === 'checkbox') {
    return Array.isArray(val) && val.length > 0;
  }

  return val !== undefined && val !== null && val !== '';
});


const startTest = () => {
  step.value = 'questions';
};

const nextQuestion = () => {
  if (currentIdx.value < questionnaire.value.questions.length - 1) {
    currentIdx.value++;
  }
};

const prevQuestion = () => {
  if (currentIdx.value > 0) {
    currentIdx.value--;
  }
};

const submitTest = async () => {
  submitting.value = true;
  
  // Válaszok formázása beküldéshez és pontszámítás
  const formattedAnswers = questionnaire.value.questions.map(q => {
    const rawValue = answers.value[q.id];
    // checkbox: több válasz, több pont
    if (q.type === 'checkbox') {
      const selected = answers.value[q.id] || [];
      const points = q.options
        .filter(o => selected.includes(o.label))
        .reduce((sum, o) => sum + o.points, 0);
      return {
        questionId: q.id,
        value: selected,
        points
      };
    }
    // scale: slider -> index alapján opció
    if (q.type === 'scale') {
      const index = typeof rawValue === 'number' ? rawValue - 1 : -1;
      const selectedOption = q.options?.[index];
      return {
        questionId: q.id,
        value: rawValue,
        points: selectedOption ? selectedOption.points : 0
      };
    }
    // radio / text (single value)
    const selectedOption = q.options?.find(o => o.label === rawValue);
    return {
      questionId: q.id,
      value: rawValue,
      points: selectedOption ? selectedOption.points : 0
    };
  });

  try {
    const res = await $fetch('/api/questionnaire/submit', {
      method: 'POST',
      body: {
        questionnaireId: questionnaire.value._id,
        answers: formattedAnswers
      }
    });

    if (res.ok) {
      totalScore.value = res.totalScore;
      step.value = 'result';
    }
  } catch (err) {
    alert('Hiba történt a mentés során. Kérjük próbálja meg később.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.transition-swing {
  transition: all 0.2s ease-in-out;
}
.shadow-lg {
  box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
}
</style>