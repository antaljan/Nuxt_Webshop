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
  templates: { type: Array, default: () => [] }
})

const canvasEl = ref(null)
let chartInstance = null

onMounted(() => {
  if (!canvasEl.value) return

  const labels = props.templates.map(t => t.subject)
  const opens = props.templates.map(t => t.opens)

  chartInstance = new Chart(canvasEl.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Megnyitások',
          data: opens,
          backgroundColor: 'rgba(76, 175, 80, 0.7)'
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
div { height: 300px; }
</style>
