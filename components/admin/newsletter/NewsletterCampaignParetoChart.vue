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

const chartData = computed(() => {
  const items = props.data || []

  return {
    labels: items.map(i => i.campaignName || 'Ismeretlen kampány'),
    datasets: [
      {
        type: 'bar',
        label: 'Megnyitási arány (%)',
        data: items.map(i => i.openRate),
        backgroundColor: '#FF9800'
      },
      {
        type: 'line',
        label: 'Kattintási arány (%)',
        data: items.map(i => i.clickRate),
        borderColor: '#4CAF50',
        backgroundColor: 'transparent',
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { beginAtZero: true },
    y1: {
      beginAtZero: true,
      position: 'right',
      grid: { drawOnChartArea: false }
    }
  }
}
</script>
