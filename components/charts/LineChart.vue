<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

const props = defineProps({
  chartData: { type: Object, required: true }
})

const canvas = ref(null)
let chart = null

const renderChart = () => {
  if (!canvas.value || !props.chartData) return

  if (chart) chart.destroy()

  chart = new Chart(canvas.value, {
    type: 'line',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

onMounted(renderChart)

watch(() => props.chartData, renderChart)

onBeforeUnmount(() => {
  if (chart) chart.destroy()
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}
</style>
