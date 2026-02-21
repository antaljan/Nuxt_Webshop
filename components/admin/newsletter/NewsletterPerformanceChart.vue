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
  stats: {
    type: Array,
    default: () => []
  }
})

const canvasEl = ref(null)
let chartInstance = null

onMounted(() => {
  if (!canvasEl.value) return

  const labels = props.stats.map(s =>
    new Date(s.sentAt).toLocaleDateString('hu-HU', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    })
  )

  const opens = props.stats.map(s => s.opens)
  const clicks = props.stats.map(s => s.clicks)

  chartInstance = new Chart(canvasEl.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Megnyitások',
          data: opens,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 4
        },
        {
          label: 'Kattintások',
          data: clicks,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  })
})

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
div {
  height: 350px;
}
</style>
