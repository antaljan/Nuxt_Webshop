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
    labels: items.map(i => i.campaignName || 'Névtelen'),
    datasets: [
      {
        type: 'line', // A kattintás legyen legfelül
        label: 'Kattintás (%)',
        data: items.map(i => i.clickRate),
        borderColor: '#4CAF50',
        backgroundColor: 'transparent',
        tension: 0.3,
        yAxisID: 'y',
        order: 1 // Elsőrendű (legfelül)
      },
      {
        type: 'line', // A megnyitás a következő
        label: 'Megnyitás (%)',
        data: items.map(i => i.openRate),
        borderColor: '#FF9800',
        backgroundColor: 'transparent',
        tension: 0.3,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'bar', // Az oszlop legyen leghátul
        label: 'Kiküldési állapot (%)',
        data: items.map(i => i.deliveryRate),
        backgroundColor: 'rgba(33, 150, 243, 0.3)', // Adjunk neki egy kis átlátszóságot (0.3)
        order: 3 // Utolsó (leghátul)
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
