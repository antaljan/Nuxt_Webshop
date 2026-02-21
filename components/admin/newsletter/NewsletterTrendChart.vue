<template>
  <div class="w-full">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script setup>
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

const props = defineProps({
  trend: { type: Array, default: () => [] }
})

const canvasEl = ref(null)
let chartInstance = null

onMounted(() => {
  if (!canvasEl.value) return

  const labels = props.trend.map(t => t.month)
  const opens = props.trend.map(t => t.opens)
  const clicks = props.trend.map(t => t.clicks)

  chartInstance = new Chart(canvasEl.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Megnyitások',
          data: opens,
          borderColor: '#4CAF50',
          tension: 0.3
        },
        {
          label: 'Kattintások',
          data: clicks,
          borderColor: '#2196F3',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
})

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
div { height: 350px; }
</style>
