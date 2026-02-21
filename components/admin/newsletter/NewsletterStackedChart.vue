<template>
  <div class="w-full">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script setup>
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const props = defineProps({
  stats: { type: Array, default: () => [] }
})

const canvasEl = ref(null)
let chartInstance = null

onMounted(() => {
  if (!canvasEl.value) return

  const labels = props.stats.map(s =>
    new Date(s.sentAt).toLocaleDateString('hu-HU')
  )

  const recipients = props.stats.map(s => s.recipients)
  const opens = props.stats.map(s => s.opens)
  const clicks = props.stats.map(s => s.clicks)

  chartInstance = new Chart(canvasEl.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Címzettek',
          data: recipients,
          backgroundColor: 'rgba(158, 158, 158, 0.6)'
        },
        {
          label: 'Megnyitások',
          data: opens,
          backgroundColor: 'rgba(76, 175, 80, 0.7)'
        },
        {
          label: 'Kattintások',
          data: clicks,
          backgroundColor: 'rgba(33, 150, 243, 0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
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
