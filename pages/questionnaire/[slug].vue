<template>
  <v-container class="py-4">
    <v-responsive max-width="600">

      <!-- LOADING -->
      <v-card v-if="pending" flat class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" size="48" />
        <div class="mt-3 text-grey-darken-1">Kérdőív betöltése...</div>
      </v-card>

      <!-- ERROR -->
      <v-card v-else-if="error || !questionnaire" flat class="text-center pa-8">
        <v-icon size="48" color="error">mdi-alert-circle-outline</v-icon>
        <h2 class="mt-3 text-h6">Sajnáljuk, a kérdőív nem található.</h2>
        <v-btn to="/" class="mt-4" variant="text">Vissza a főoldalra</v-btn>
      </v-card>

      <!-- CONTENT -->
      <template v-else>

        <!-- INTRO -->
        <v-card
          v-if="step === 'intro'"
          border
          class="rounded-lg pa-4"
        >
          <v-chip size="small" color="primary" variant="flat" class="mb-2">
            {{ questionnaire.language }} felmérés
          </v-chip>

          <h1 class="text-h5 font-weight-bold mb-3">
            {{ questionnaire.title }}
          </h1>

          <p class="text-body-2 text-grey-darken-2 mb-4">
            {{ questionnaire.description }}
          </p>

          <v-btn 
            block 
            color="primary"
            size="large"
            rounded="lg"
            @click="startTest"
          >
            Teszt indítása
          </v-btn>
        </v-card>

        <!-- QUESTIONS -->
        <v-card
          v-else-if="step === 'questions'"
          border
          class="rounded-lg pa-4"
        >
          <!-- PROGRESS -->
          <v-progress-linear
            :model-value="progress"
            color="primary"
            height="6"
            rounded
            class="mb-4"
          />

          <div class="text-caption text-grey-darken-1 mb-3">
            Kérdés: {{ currentIdx + 1 }} / {{ questionnaire.questions.length }}
          </div>

          <!-- QUESTION WINDOW -->
          <v-window v-model="currentIdx">
            <v-window-item
              v-for="(q, idx) in questionnaire.questions"
              :key="idx"
            >
              <h2 class="text-subtitle-1 font-weight-medium mb-3">
                {{ q.text }}
              </h2>

              <!-- RADIO -->
              <div v-if="q.type === 'radio'">
                <v-radio-group v-model="answers[q.id]" hide-details>
                  <v-radio
                    v-for="opt in q.options"
                    :key="opt.label"
                    :label="opt.label"
                    :value="opt.label"
                    density="compact"
                    class="mb-1"
                  />
                </v-radio-group>
              </div>

              <!-- SCALE -->
              <div v-if="q.type === 'scale'" class="my-4">
                <v-slider
                  v-model="answers[q.id]"
                  :min="1"
                  :max="q.options.length"
                  :step="1"
                  color="primary"
                  track-color="grey-lighten-2"
                  thumb-size="20"
                  hide-details
                />
                <div class="d-flex justify-space-between text-caption mt-1">
                  <span v-for="opt in q.options" :key="opt.label">
                    {{ opt.label }}
                  </span>
                </div>
              </div>

              <!-- CHECKBOX -->
              <div v-if="q.type === 'checkbox'">
                <v-checkbox
                  v-for="opt in q.options"
                  :key="opt.label"
                  v-model="answers[q.id]"
                  :label="opt.label"
                  :value="opt.label"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </div>

              <!-- TEXT -->
              <v-textarea
                v-if="q.type === 'text'"
                v-model="answers[q.id]"
                variant="outlined"
                rows="3"
                auto-grow
                hide-details
                class="mt-2"
                placeholder="Írd ide a válaszod..."
              />
            </v-window-item>
          </v-window>

          <!-- NAVIGATION -->
          <div class="d-flex justify-space-between mt-6">
            <v-btn 
              variant="text"
              @click="prevQuestion"
              :disabled="currentIdx === 0"
            >
              Vissza
            </v-btn>

            <v-btn 
              v-if="currentIdx < questionnaire.questions.length - 1"
              color="primary"
              :disabled="!isCurrentAnswered"
              @click="nextQuestion"
            >
              Következő
            </v-btn>

            <v-btn 
              v-else
              color="success"
              :disabled="!isCurrentAnswered"
              :loading="submitting"
              @click="submitTest"
            >
              Befejezés
            </v-btn>
          </div>
        </v-card>

        <!-- RESULT -->
        <v-card
          v-else-if="step === 'result'"
          border
          class="rounded-lg pa-6 text-center"
        >
          <v-icon size="64" color="success" class="mb-3">
            mdi-check-decagram
          </v-icon>

          <h2 class="text-h5 font-weight-bold mb-2">
            Köszönjük a kitöltést!
          </h2>

          <p class="text-body-2 text-grey-darken-1 mb-4">
            A válaszaidat rögzítettük.
          </p>

          <v-divider class="mb-4" />

          <div class="text-h6 mb-4">
            Elért pontszám: <strong>{{ totalScore }}</strong>
          </div>

          <v-alert
            color="blue-lighten-5"
            icon="mdi-information"
            class="text-left mb-6"
          >
            Hamarosan jelentkezünk a részletes elemzéssel.
          </v-alert>

          <v-btn color="primary" block rounded="lg" to="/">
            Vissza a főoldalra
          </v-btn>
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

const toggleCheckbox = (id, value) => {
  if (!Array.isArray(answers.value[id])) {
    answers.value[id] = [];
  }
  const arr = answers.value[id];
  if (arr.includes(value)) {
    answers.value[id] = arr.filter(v => v !== value);
  } else {
    answers.value[id] = [...arr, value];
  }
};

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