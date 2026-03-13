<script setup>
// 1. Adatlekérés a Nuxt API-n keresztül
// Feltételezve, hogy a szerver oldali route: server/api/leadmagnet/admin/all.get.ts
const { data, refresh, pending } = await useFetch('/api/leadmagnet/admin/all')

const items = computed(() => data.value?.items || [])

// 2. UI állapotok
const snackbar = ref(false)
const snackText = ref('')

// 3. Segédfüggvények
const getConversionRate = (item) => {
  if (!item.views || item.views === 0) return '0.0'
  return ((item.conversions / item.views) * 100).toFixed(1)
}

const copyLink = (slug) => {
  // window.location.origin használata a dinamikus domainhez (.hu / .com)
  const url = `${window.location.origin}/lp/${slug}`
  navigator.clipboard.writeText(url)
  snackText.value = 'Link a vágólapra másolva!'
  snackbar.value = true
}

const editItem = (item) => {
  navigateTo(`/admin/leadmagnet/create?id=${item._id}`)
}

const deleteItem = async (id) => {
  if (!confirm('Biztosan törölni szeretnéd? A kapcsolódó statisztikák és tartalomblokkok is elvesznek!')) return
  try {
    // Fontos: a korábban megbeszélt admin útvonalat használjuk
    await $fetch(`/api/leadmagnet/admin/${id}`, { method: 'DELETE' })
    snackText.value = 'Lead Magnet sikeresen törölve.'
    snackbar.value = true
    await refresh()
  } catch (err) {
    snackText.value = 'Hiba történt a törlés során!'
    snackbar.value = true
  }
}
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">Lead Magnetek (Csali oldalak)</h1>
      <v-btn 
        color="primary" 
        prepend-icon="mdi-plus" 
        to="/admin/leadmagnet/create"
      >
        Új létrehozása
      </v-btn>
    </v-row>

    <v-card :loading="pending">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Név / Elérhetőség</th>
            <th class="text-center">Statisztika (Megtekintés / Konv.)</th>
            <th class="text-center">Konverziós arány</th>
            <th class="text-center">Linkek</th>
            <th class="text-right">Műveletek</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in items" :key="item._id">
            <td>
              <div class="font-weight-bold">{{ item.name || 'Névtelen Lead Magnet' }}</div>
              <div class="text-caption text-grey">/lp/{{ item.slug }}</div>
            </td>

            <td class="text-center">
              <v-chip size="small" variant="tonal" class="mr-1">
                <v-icon start size="14">mdi-eye</v-icon> {{ item.views || 0 }}
              </v-chip>
              <v-chip size="small" variant="tonal" color="success">
                <v-icon start size="14">mdi-account-check</v-icon> {{ item.conversions || 0 }}
              </v-chip>
            </td>
            
            <td class="text-center" style="min-width: 180px;">
              <div class="d-flex align-center justify-center">
                <v-progress-linear
                  :model-value="getConversionRate(item)"
                  color="success" 
                  height="12"
                  rounded
                  style="width: 100px"
                />
                <span class="ml-2 text-caption font-weight-bold">
                  {{ getConversionRate(item) }}%
                </span>
              </div>
            </td>

            <td class="text-center">
              <v-btn 
                icon="mdi-content-copy" 
                variant="text" 
                size="small" 
                @click="copyLink(item.slug)"
                title="Link másolása"
              />
              <v-btn 
                icon="mdi-open-in-new" 
                variant="text" 
                size="small" 
                color="info"
                :to="`/lp/${item.slug}`"
                target="_blank"
                title="Megtekintés"
              />
            </td>

            <td class="text-right">
               <v-btn icon="mdi-pencil" variant="text" color="primary" @click="editItem(item)" />
               <v-btn icon="mdi-delete" variant="text" color="error" @click="deleteItem(item._id)" />
            </td>
          </tr>

          <tr v-if="items.length === 0 && !pending">
            <td colspan="5" class="text-center pa-10 text-grey italic">
              Még nem hoztál létre Lead Magnet oldalt. Kattints az "Új létrehozása" gombra!
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-snackbar v-model="snackbar" timeout="2000" color="surface" theme="dark">
      {{ snackText }}
    </v-snackbar>
  </v-container>
</template>
