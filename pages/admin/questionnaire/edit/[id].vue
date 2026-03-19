<template>
  <v-container>
    <v-row>
      <v-col cols="12" d-flex justify-space-between align-center>
        <h1>Kérdőív szerkesztése</h1>
        <v-btn color="success" @click="saveQuestionnaire">Mentés</v-btn>
      </v-col>
    </v-row>

    <v-card class="pa-4 mb-4">
      <v-text-field v-model="form.title" label="Kérdőív címe (pl. Stressz-szint felmérés)" />
      <v-select v-model="form.language" :items="['hu', 'en', 'de']" label="Nyelv" />
    </v-card>

    <v-expansion-panels v-model="activePanel" variant="accordion">
      <v-expansion-panel v-for="(q, index) in form.questions" :key="index">
        <v-expansion-panel-title>
          {{ index + 1 }}. kérdés: {{ q.text || 'Üres kérdés' }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-text-field v-model="q.text" label="Kérdés szövege" />
          <v-select v-model="q.type" :items="['radio', 'checkbox', 'scale']" label="Típus" />
          
          <div v-for="(opt, oIdx) in q.options" :key="oIdx" class="d-flex mb-2">
            <v-text-field v-model="opt.label" label="Válaszlehetőség" class="mr-2" />
            <v-text-field v-model.number="opt.points" type="number" label="Pont" style="max-width: 80px" />
            <v-btn icon="mdi-delete" variant="text" color="error" @click="removeOption(index, oIdx)" />
          </div>
          <v-btn variant="tonal" size="small" @click="addOption(index)">Opció hozzáadása</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-btn block class="mt-4" prepend-icon="mdi-plus" @click="addQuestion">Új kérdés hozzáadása</v-btn>
  </v-container>
</template>

<script setup>
const form = ref({
  title: '',
  language: 'hu',
  questions: []
});

const addQuestion = () => {
  form.value.questions.push({
    text: '',
    type: 'radio',
    options: [{ label: '', points: 0 }]
  });
};

const addOption = (qIdx) => {
  form.value.questions[qIdx].options.push({ label: '', points: 0 });
};

const removeOption = (qIdx, oIdx) => {
  form.value.questions[qIdx].options.splice(oIdx, 1);
};

const saveQuestionnaire = async () => {
  // Ide jön majd az API hívás a backendre
  console.log('Mentés:', form.value);
};
</script>