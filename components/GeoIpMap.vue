<template>
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { MapChart } from 'echarts/charts'
import { TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

const countryNames = {
  DE: "Germany",
  GB: "United Kingdom",
  NL: "Netherlands",
  FR: "France",
  US: "United States",
  KN: "Saint Kitts and Nevis",
  PT: "Portugal",
  AR: "Argentina",
  TW: "Taiwan",
  IR: "Iran",
  RU: "Russia",
  IN: "India"
}

echarts.use([
  MapChart,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer
])

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const chart = ref(null)

let instance = null

async function loadWorldMap() {
  const res = await fetch('/maps/world.json')   // <-- saját fájl
  const worldJson = await res.json()
  echarts.registerMap('world', worldJson)
}

onMounted(async () => {
  await loadWorldMap()
  instance = echarts.init(chart.value)
  render()
})

watch(
  () => props.data,
  () => {
    if (instance) render()
  },
  { deep: true }
)

const mapData = props.data.map(i => ({
  name: countryNames[i._id] || i._id,   // fallback
  value: i.count
}))

function render() {
  if (!instance) return

  instance.setOption({
    tooltip: { trigger: 'item' },
    visualMap: {
      min: 0,
      max: Math.max(...props.data.map(i => i.count), 10),
      text: ['High', 'Low'],
      realtime: false,
      calculable: true,
      inRange: { color: ['#e0f3ff', '#1867C0'] }
    },
    series: [
      {
      name: 'Gyanús aktivitás',
      type: 'map',
      map: 'world',
      roam: true,
      data: mapData
      }
    ]
  })
}
</script>
