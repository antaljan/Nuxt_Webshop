<template>
  <div class="w-full">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>

<script setup>
import {
  Chart,
  Tooltip,
  Legend
} from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'

Chart.register(MatrixController, MatrixElement, Tooltip, Legend)

const props = defineProps({
  heatmap: { type: Array, default: () => [] }
})

const canvasEl = ref(null)
let chartInstance = null

onMounted(() => {
  if (!canvasEl.value) return

  const data = props.heatmap.map(h => ({
    x: h.hour,
    y: h.day,
    v: h.opens
  }))

  chartInstance = new Chart(canvasEl.value, {
    type: 'matrix',
    data: {
      datasets: [
        {
          label: 'Megnyitások',
          data,
          backgroundColor: ctx => {
            const item = ctx.dataset.data?.[ctx.dataIndex]
            if (!item || typeof item.v !== 'number') {
              return 'rgba(0,0,0,0)' // vagy bármilyen default
            }
              return `rgba(33, 150, 243, ${item.v / 20})`
          },
          width: ({ chart }) => {
            const area = chart.chartArea;
            return area ? area.width / 24 : 0;
          },
          height: ({ chart }) => {
            const area = chart.chartArea;
            return area ? area.height / 7 : 0;
          }
        }
      ]
    },
    options: {
      scales: {
        x: { type: 'linear', min: 0, max: 23 },
        y: { type: 'linear', min: 0, max: 6 }
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
