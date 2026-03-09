<template>
  <BarChart
    :chart-data="chartData"
    :chart-options="chartOptions"
  />
</template>

<script setup>
import { computed } from 'vue'
import BarChart from '~/components/charts/BarChart.vue'

const props = defineProps({
  data: { type: Array, required: true }
})

const chartData = computed(() => ({
  labels: props.data.map(i => i.hour),
  datasets: [
    {
      label: 'Küldött / ütemezett levelek száma',
      data: props.data.map(i => i.total),
      backgroundColor: '#2196F3'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true }
  }
}
</script>
