<script setup>
import { ref, watch, onMounted } from 'vue'
import { useBrand } from '@/composables/useBrand'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { settings, loadBrand, saveBrand } = useBrand()

// Helyi másolat az adatok szerkesztéséhez alapértelmezett értékekkel
const local = ref({
  primaryColor: '#b87d8e',
  backgroundColor: '#f7f5f8',
  textColor: '#2d3142',
  accentColor: '#1d3557',
  fontFamily: 'Inter',
  titleFontFamily: 'Playfair Display',
  maintenanceMode: false
})

const fonts = [
  'Inter', 'Lato', 'Montserrat', 'Playfair Display', 'Merriweather',
  'Source Sans Pro', 'Source Serif Pro', 'Lora', 'Cormorant Garamond',
  'Libre Baskerville', 'Roboto', 'Georgia', 'Times New Roman', 'Arial', 'Verdana'
]

// Opcionális: Segédfüggvény a Google Fonts URL-ek dinamikus előkészítéséhez
function updatePreviewFonts(font, titleFont) {
  if (typeof window === 'undefined') return
  const id = 'dynamic-preview-fonts'
  let link = document.getElementById(id)
  if (!link) {
    link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  // URL kódoljuk a betűtípusok neveit a biztonság kedvéért (pl. szóközök helyett + jel)
  const f1 = font.replace(/ /g, '+')
  const f2 = titleFont.replace(/ /g, '+')
  link.href = `https://googleapis.com{f1}&family=${f2}&display=swap`
}

// Figyeljük a betűtípusok változását, és azonnal betöltjük őket a böngészőbe
watch(
  [() => local.value.fontFamily, () => local.value.titleFontFamily],
  ([newFont, newTitleFont]) => {
    updatePreviewFonts(newFont, newTitleFont)
  },
  { immediate: true }
)

// Beállítások betöltése induláskor
onMounted(async () => {
  await loadBrand()
  if (settings.value) {
    local.value = {
      ...settings.value,
      maintenanceMode: settings.value.maintenanceMode ?? false
    }
  }
})

// Mentés kezelő
async function save() {
  await saveBrand(local.value)
  alert('Brand settings saved!')
}

// Alapértelmezett értékek visszaállítása
function resetDefaults() {
  local.value = {
    primaryColor: '#b87d8e',
    backgroundColor: '#f7f5f8',
    textColor: '#2d3142',
    accentColor: '#1d3557',
    fontFamily: 'Inter',
    titleFontFamily: 'Playfair Display',
    maintenanceMode: false
  }
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto"> <!-- Megnövelve max-w-6xl-re a szebb elrendezésért -->

    <h1 class="text-3xl font-bold mb-6">{{ t('admin.brand.menu') }}</h1>

    <!-- FORM ÉS ELŐNÉZET RÁCS -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

      <!-- BAL OLDAL: BEÁLLÍTÁSOK -->
      <div class="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
        
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Arculati Színek</h2>

        <!-- BACKGROUND COLOR -->
        <div class="flex items-center justify-between">
          <label class="font-semibold text-gray-600">{{ t('admin.brand.background') }}</label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-mono">{{ local.backgroundColor }}</span>
            <input type="color" v-model="local.backgroundColor" class="w-12 h-10 border rounded cursor-pointer" />
          </div>
        </div>

        <!-- PRIMARY COLOR -->
        <div class="flex items-center justify-between">
          <label class="font-semibold text-gray-600">{{ t('admin.brand.primary') }}</label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-mono">{{ local.primaryColor }}</span>
            <input type="color" v-model="local.primaryColor" class="w-12 h-10 border rounded cursor-pointer" />
          </div>
        </div>

        <!-- ACCENT COLOR -->
        <div class="flex items-center justify-between">
          <label class="font-semibold text-gray-600">{{ t('admin.brand.accent') }}</label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-mono">{{ local.accentColor }}</span>
            <input type="color" v-model="local.accentColor" class="w-12 h-10 border rounded cursor-pointer" />
          </div>
        </div>

        <!-- TEXT COLOR -->
        <div class="flex items-center justify-between">
          <label class="font-semibold text-gray-600">{{ t('admin.brand.text') }}</label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-mono">{{ local.textColor }}</span>
            <input type="color" v-model="local.textColor" class="w-12 h-10 border rounded cursor-pointer" />
          </div>
        </div>

        <h2 class="text-xl font-semibold pt-4 text-gray-700 border-b pb-2">Tipográfia (Betűtípusok)</h2>

        <!-- basic TEXT FONT FAMILY -->
        <div class="flex items-center justify-between">
          <label class="font-semibold text-gray-600">{{ t('admin.brand.font') }}</label>
          <select v-model="local.fontFamily" class="border rounded px-3 py-2 w-48 bg-gray-50 font-medium text-gray-700">
            <option v-for="f in fonts" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>

        <!-- title text FONT FAMILY -->
        <div class="flex items-center justify-between">
          <label class="font-semibold text-gray-600">{{ t('admin.brand.titlefont') }}</label>
          <select v-model="local.titleFontFamily" class="border rounded px-3 py-2 w-48 bg-gray-50 font-medium text-gray-700">
            <option v-for="f in fonts" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>


        <!-- MAINTENANCE MODE -->
        <div class="mt-8 p-4 border rounded-lg bg-red-50 border-red-200">
          <label class="font-semibold text-red-700 text-lg block mb-2">
            Karbantartási mód (Coming Soon Page)
          </label>
          <p class="text-sm text-red-600 mb-4">
            Ha ez be van kapcsolva, a weboldal látogatói egy karbantartási üzenetet fognak látni, amíg vissza nem kapcsolod.
            Adminisztrátorként továbbra is hozzáférsz a tartalomhoz, de a látogatók nem fogják látni a weboldal tartalmát.
          </p>
          <v-btn
            :color="local.maintenanceMode ? 'red' : 'green'"
            class="w-full py-4 text-lg font-bold text-white"
            @click="local.maintenanceMode = !local.maintenanceMode"
          >
            {{ local.maintenanceMode ? 'Karbantartási mód kikapcsolása' : 'Karbantartási mód bekapcsolása' }}
          </v-btn>
        </div>

        <!-- BUTTONS -->
 <!-- JAVÍTOTT / RESPONSIVE rész -->
<div class="flex flex-wrap gap-3 mt-6 border-t pt-4">
  <!-- Mentés gomb -->
  <v-btn 
    color="success" 
    size="large" 
    @click="save" 
    prepend-icon="mdi-check"
    class="flex-grow md:flex-grow-0"
  >
    {{ t('common.save') }}
  </v-btn>
  
  <!-- Reset gomb rövidebb szöveggel -->
  <v-btn 
    color="grey" 
    variant="outlined" 
    size="large" 
    @click="resetDefaults" 
    prepend-icon="mdi-refresh"
    class="flex-grow md:flex-grow-0"
  >
    Reset
  </v-btn>
</div>


      </div>

      <!-- JOBB OLDAL: MEGUJULALÓ ÉLŐ ELŐNÉZET -->
      <div class="sticky top-6 space-y-4">
        <span class="text-xs uppercase font-bold text-gray-400 tracking-wider">Élő előnézet (Live Preview)</span>
        
        <div class="border rounded-xl shadow-lg p-8 transition-all duration-300 min-h-[400px] flex flex-col justify-between"
             :style="{
               backgroundColor: local.backgroundColor,
               color: local.textColor,
               fontFamily: local.fontFamily
             }">

          <div>
            <!-- FŐCÍM: A specifikus címsor betűtípussal és az elsődleges márkaszínnel -->
            <h2 class="text-3xl font-bold mb-2 transition-all"
                :style="{ 
                  color: local.primaryColor,
                  fontFamily: local.titleFontFamily 
                }">
              {{ t('admin.brand.previewTitle') || 'Főcím Tesztelése' }}
            </h2>
            
            <!-- KIEMELT ALCÍM: Az accentColor-al (Akszentus szín) meghajtva -->
            <h3 class="text-md font-semibold mb-6 uppercase tracking-wide"
                :style="{ color: local.accentColor }">
              Kiemelt Alcím (Accent Color)
            </h3>

            <!-- TÖRZSSZÖVEG -->
            <p class="mb-6 leading-relaxed text-base">
              {{ t('admin.brand.previewText') || 'Ez a törzsszöveg mintája. Itt látható, hogyan jelennek meg a blogbejegyzések, leírások és apró betűs részek a feleséged oldalán. Válts betűtípust bal oldalon a változás azonnali megtekintéséhez.' }}
            </p>
          </div>

          <!-- AKCIÓGOMBOK: Elsődleges színű gomb és egy másodlagos/visszafogott link -->
          <div class="flex items-center gap-4 mt-auto">
            <button class="px-6 py-3 rounded-lg font-bold shadow-md transition-transform active:scale-95 text-white"
                    :style="{
                      backgroundColor: local.primaryColor
                    }">
              {{ t('admin.brand.previewButton') || 'Elsődleges CTA Gomb' }}
            </button>
            
            <button class="px-4 py-2 font-semibold bg-transparent transition-colors"
                    :style="{ color: local.accentColor }">
              Mégse / Info
            </button>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>
