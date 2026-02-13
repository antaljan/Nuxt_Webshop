<template>
  <div class="bg-blue-darken-4 p-6 text-white rounded-xl mb-6">
    <v-row>
      <v-col cols="12" md="4">
        <h2 class="text-2xl font-bold mb-4">{{ $t('admin.newsletter.title') }}</h2>

        <v-row dense>
          <v-col v-for="(val, key) in statsMap" :key="key" cols="6">
            <div class="bg-white/10 p-3 rounded-lg border border-white/10">
              <div class="text-xs uppercase opacity-70">
                {{ $t(`admin.newsletter.stats.${key}`) }}
              </div>
              <div class="text-2xl font-black">{{ val }}</div>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="8">
        <v-card theme="dark" variant="flat" class="bg-white/5 pa-4 rounded-lg h-full">
          <div class="text-subtitle-2 mb-2 opacity-70 text-center uppercase">
            Utolsó 5 kampány teljesítménye (%)
          </div>

          <div class="h-[200px]">
            <ChartsBarChart 
              v-if="chartData" 
              :chart-data="chartData" 
              :options="chartOptions" 
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
defineProps({
  statsMap: Object,
  chartData: Object,
  chartOptions: Object
})
</script>
