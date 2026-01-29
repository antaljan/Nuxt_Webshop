<template>
  <v-container class="py-10">
    <div class="d-flex align-center mb-6">
      <h1 class="text-h5">Médiatár</h1>
      <v-spacer />
      <!-- Itt használhatod a már meglévő i18n-t a manuális reactive helyett -->
      <v-btn color="secondary" to="/">
        {{ $t('common.backtohome') }}
      </v-btn>
    </div>

    <v-row v-if="images && images.length > 0">
      <v-col
        v-for="img in images"
        :key="img.filename"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card variant="outlined">
          <!-- A backendBase-t a runtimeConfig-ból vesszük -->
          <v-img 
            :src="`${config.public.backendBase}/uploads/${img.filename}`" 
            height="180" 
            cover
            class="bg-grey-lighten-2"
          />
          
          <v-card-title class="text-caption text-truncate">
            {{ img.filename }}
          </v-card-title>

          <v-card-actions>
            <v-spacer />
            <v-btn 
              color="red-lighten-1" 
              icon="mdi-delete" 
              variant="text"
              @click="deleteImage(img.filename)" 
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" variant="tonal" class="mt-4">
      Nincsenek feltöltött képek.
    </v-alert>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

// Admin Guard (mivel ez az /admin alatt van)
definePageMeta({
  middleware: 'auth' // vagy az admin middleware-ed
})

const config = useRuntimeConfig()

// SSR-safe adatlekérés a proxy-don keresztül
// A listád szerint: /server/api/images/index.get.ts létezik
const { data: images, refresh } = await useFetch('/api/images', {
  headers: useRequestHeaders(['cookie'])
})

// Kép törlése
async function deleteImage(filename) {
  if (!confirm('Biztosan törlöd ezt a képet?')) return

  try {
    // A listád szerint: /server/api/images/[filename].delete.ts létezik
    await $fetch(`/api/images/${filename}`, { 
      method: 'DELETE',
      headers: useRequestHeaders(['cookie'])
    })
    await refresh() // Lista frissítése
  } catch (err) {
    console.error('Törlési hiba:', err)
    alert('Hiba történt a törlés során.')
  }
}

// A nyelvváltás figyelése (MutationObserver) Nuxt-ban szükségtelen, 
// mert az $t() és a locale automatikusan reaktív.
</script>
