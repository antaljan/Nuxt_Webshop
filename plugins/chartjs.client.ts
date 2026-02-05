// plugins/chartjs.client.ts
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js'

export default defineNuxtPlugin(() => {
  // Regisztráljuk a Filler-t és az alapvető komponenseket
  Chart.register(
    Title, 
    Tooltip, 
    Legend, 
    BarElement, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Filler
  )
})