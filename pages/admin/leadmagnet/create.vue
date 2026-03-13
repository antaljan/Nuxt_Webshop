<script setup>
const { t } = useI18n()
const router = useRouter()

// 1. Alapértelmezett SEO és Szekció struktúra
const form = ref({
  name: '',
  slug: '',
  seo: {
    hu: { title: '', description: '' },
    en: { title: '', description: '' },
    de: { title: '', description: '' }
  },
  sections: [
    { type: 'Hero', key: '' } // Az első szekció alapból egy Hero
  ]
})

// 2. Elérhető komponens típusok
const componentTypes = ['Hero', 'HtmlText', 'ImageText', 'Separator', 'Contact', 'Feedback']

const addSection = (type) => {
  // Generálunk egy egyedi kulcsot, pl: lm-stressz-hero-123
  const uniqueKey = `lm-${form.value.slug || 'new'}-${type.toLowerCase()}-${Date.now()}`
  form.value.sections.push({ type, key: uniqueKey, props: {} })
}

const removeSection = (index) => form.value.sections.splice(index, 1)

// 3. Mentés a Backend-re (Nuxt Server Route -> Node Backend)
const saveLeadMagnet = async () => {
  try {
    // 1. Lead Magnet struktúra mentése
    const res = await $fetch('/api/leadmagnet/create', {
      method: 'POST',
      body: form.value
    })

    if (res.ok) {
      // 2. Dummy tartalom inicializálása minden szekcióhoz (HU, EN, DE)
      const languages = ['hu', 'en', 'de']
      
      for (const section of form.value.sections) {
        for (const lang of languages) {
          // Csak akkor hozzuk létre, ha még nem létezik (biztonsági játék)
          await $fetch(`/api/content/${section.key}/${lang}`, {
            method: 'PUT',
            body: {
              title: `Új ${section.type} szekció`, // Ez hiányzott!
              subtitle: "Alszöveg helye...",      // Biztonság kedvéért
              paragraphs: ["Kezdj el gépelni..."],
              html: "<p>Kezdj el gépelni...</p>",
              image: "/uploads/placeholder.jpg",
              ctaText: "Kattints ide",
              ctaLink: "#"
              }
          }).catch(err => console.log(`${section.key} már létezett vagy hiba történt`))
        }
      }

      router.push(`/lp/${form.value.slug}`)
    }
  } catch (err) {
    console.error("Hiba a mentés során:", err)
  }
}

</script>

<template>
  <v-container>
    <v-card title="Új Lead Magnet Létrehozása" class="pa-6">
      <v-text-field v-model="form.name" label="Belső megnevezés" variant="outlined" />
      <v-text-field v-model="form.slug" label="URL Slug (pl: ingyen-ebook)" variant="outlined" prefix="/lp/" />

      <v-divider class="my-6" />

      <!-- SEO Szekció -->
      <h3 class="mb-4">SEO Beállítások (HU)</h3>
      <v-text-field v-model="form.seo.hu.title" label="SEO Title" variant="underlined" />
      <v-textarea v-model="form.seo.hu.description" label="SEO Meta Description" rows="2" variant="underlined" />

      <v-divider class="my-6" />

      <!-- Szekcióépítő (Drag-and-drop-hoz a vuedraggable-t ajánlom itt) -->
      <h3 class="mb-4">Oldal felépítése</h3>
      <div v-for="(sec, index) in form.sections" :key="index" class="d-flex align-center gap-4 mb-2">
        <v-chip color="primary">{{ sec.type }}</v-chip>
        <v-text-field v-model="sec.key" label="Szekció kulcs (adatbázis ID)" density="compact" hide-details />
        <v-btn icon="mdi-delete" color="error" variant="text" @click="removeSection(index)" />
      </div>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="secondary" prepend-icon="mdi-plus" class="mt-4">Szekció hozzáadása</v-btn>
        </template>
        <v-list>
          <v-list-item v-for="type in componentTypes" :key="type" @click="addSection(type)">
            {{ type }}
          </v-list-item>
        </v-list>
      </v-menu>

      <v-card-actions class="mt-10">
        <v-spacer />
        <v-btn color="success" size="large" variant="elevated" @click="saveLeadMagnet">
          Mentés és Tartalom Szerkesztése
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
