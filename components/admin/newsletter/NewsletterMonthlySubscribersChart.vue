<template>
  <LineChart
    :chart-data="chartData"
    :chart-options="chartOptions"
  />
</template>

<script setup>
import { computed } from 'vue'
import LineChart from '~/components/charts/LineChart.vue'

const props = defineProps({
  data: { type: Array, required: true }
})

const chartData = computed(() => ({
  labels: props.data.map(i => i.month),
  datasets: [
    {
      label: 'Feliratkozók száma',
      data: props.data.map(i => i.count),
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      tension: 0.3
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>
