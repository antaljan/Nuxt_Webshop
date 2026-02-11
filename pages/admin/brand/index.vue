<script setup>
import { ref, watch, onMounted } from 'vue'
import { useBrand } from '@/composables/useBrand'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { settings, loadBrand, saveBrand } = useBrand()

// local copy for editing
const local = ref({
  primaryColor: '#673fff',
  backgroundColor: '#ffffff',
  textColor: '#222222',
  accentColor: '#8566ff',
  fontFamily: 'Roboto',
  maintenanceMode: false
})


const fonts = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Playfair Display',
  'Inter',
  'Poppins'
]

// load settings on mount
onMounted(async () => {
  await loadBrand()
  if (settings.value) {
    local.value = {
      ...settings.value,
      maintenanceMode: settings.value.maintenanceMode ?? false
    }
  }
})

// save handler
async function save() {
  await saveBrand(local.value)
  alert('Brand settings saved!')
}

// reset to defaults
function resetDefaults() {
  local.value = {
    primaryColor: '#673fff',
    backgroundColor: '#ffffff',
    textColor: '#222222',
    accentColor: '#8566ff',
    fontFamily: 'Roboto'
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">

    <h1 class="text-3xl font-bold mb-6">{{ t('admin.brand.menu') }}</h1>

    <!-- FORM -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <!-- LEFT SIDE: FORM -->
      <div class="space-y-6">

        <!-- PRIMARY COLOR -->
        <div>
          <label class="font-semibold">{{ t('admin.brand.primary') }}</label>
          <input type="color" v-model="local.primaryColor" class="w-16 h-10 ml-4" />
        </div>

        <!-- BACKGROUND COLOR -->
        <div>
          <label class="font-semibold">{{ t('admin.brand.background') }}</label>
          <input type="color" v-model="local.backgroundColor" class="w-16 h-10 ml-4" />
        </div>

        <!-- TEXT COLOR -->
        <div>
          <label class="font-semibold">{{ t('admin.brand.text') }}</label>
          <input type="color" v-model="local.textColor" class="w-16 h-10 ml-4" />
        </div>

        <!-- ACCENT COLOR -->
        <div>
          <label class="font-semibold">{{ t('admin.brand.accent') }}</label>
          <input type="color" v-model="local.accentColor" class="w-16 h-10 ml-4" />
        </div>

        <!-- FONT FAMILY -->
        <div>
          <label class="font-semibold">{{ t('admin.brand.font') }}</label>
          <select v-model="local.fontFamily" class="border rounded px-3 py-2 ml-4">
            <option v-for="f in fonts" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>

        <!-- MAINTENANCE MODE -->
        <div class="mt-8 p-4 border rounded-lg bg-red-50">
          <label class="font-semibold text-red-700 text-lg block mb-2">
            Karbantartási mód (Coming Soon Page)
          </label>
          <p class="text-sm text-red-600 mb-4">
            Ha ez be van kapcsolva, a weboldal látogatói egy karbantartási üzenetet fognak látni, amíg vissza nem kapcsolod.
            Adminisztrátorként továbbra is hozzáfész a tartalomhoz, de a látogatók nem fogják látni a weboldal tartalmát.
          </p>
          <v-btn
            :color="local.maintenanceMode ? 'red' : 'green'"
            class="w-full py-4 text-lg font-bold"
            @click="local.maintenanceMode = !local.maintenanceMode"
          >
            {{ local.maintenanceMode ? 'kikapcsolni a karbantartási módot' : 'Bekapcsolni karbantartási módot' }}
          </v-btn>
        </div>

        <!-- BUTTONS -->
        <div class="flex gap-4 mt-6">
          <v-btn color="primary" @click="save">{{ t('common.save') }}</v-btn>
          <v-btn color="secondary" @click="resetDefaults">{{ t('common.reset') }}</v-btn>
        </div>

      </div>

      <!-- RIGHT SIDE: LIVE PREVIEW -->
      <div class="border rounded-lg shadow p-6"
           :style="{
             background: local.backgroundColor,
             color: local.textColor,
             fontFamily: local.fontFamily
           }">

        <h2 class="text-2xl font-bold mb-4"
            :style="{ color: local.primaryColor }">
          {{ t('admin.brand.previewTitle') }}
        </h2>

        <p class="mb-4">
          {{ t('admin.brand.previewText') }}
        </p>

        <button class="px-4 py-2 rounded font-semibold"
                :style="{
                  background: local.primaryColor,
                  color: '#fff'
                }">
          {{ t('admin.brand.previewButton') }}
        </button>

      </div>

    </div>

  </div>
</template>
