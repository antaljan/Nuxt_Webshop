<template>
  <v-container>
    <v-card :title="isEdit ? 'Lead Magnet Szerkesztése' : 'Új Lead Magnet Létrehozása'" class="pa-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="form.name" label="Belső megnevezés" variant="outlined" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="form.slug" 
            label="URL Slug" 
            variant="outlined" 
            prefix="/lp/" 
            :disabled="isEdit"
            hint="A slug mentés után nem módosítható a hivatkozások védelme érdekében"
          />
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <h3 class="mb-4">SEO Beállítások</h3>
      <v-tabs v-model="seoTab" color="primary">
        <v-tab value="hu">Magyar</v-tab>
        <v-tab value="en">English</v-tab>
        <v-tab value="de">Deutsch</v-tab>
      </v-tabs>

      <v-window v-model="seoTab" class="mt-4">
        <v-window-item v-for="lang in ['hu', 'en', 'de']" :key="lang" :value="lang">
          <v-text-field v-model="form.seo[lang].title" :label="`SEO Title (${lang.toUpperCase()})`" variant="underlined" />
          <v-textarea v-model="form.seo[lang].description" :label="`Meta Description (${lang.toUpperCase()})`" rows="2" variant="underlined" />
        </v-window-item>
      </v-window>

      <v-divider class="my-6" />

      <div class="d-flex align-center justify-space-between mb-4">
        <h3>Oldal felépítése</h3>
        <small class="text-grey">Húzd a szekciókat a sorrend módosításához</small>
      </div>

      <draggable 
        v-model="form.sections" 
        item-key="key" 
        handle=".handle"
        ghost-class="ghost"
      >
        <template #item="{ element, index }">
          <v-card variant="outlined" class="mb-3 pa-3 d-flex align-center gap-4 bg-surface">
            <v-icon icon="mdi-drag-vertical" class="handle cursor-move" color="grey" />
            <v-chip
              :color="element.type === 'Subscribe' ? 'secondary' : 'primary'"
              label
            >
              {{ element.type }}
            </v-chip>
            <v-text-field 
              v-model="element.key" 
              label="Szekció kulcs" 
              density="compact" 
              hide-details 
              variant="plain"
              class="flex-grow-1"
              readonly
            />
            <v-btn icon="mdi-delete" color="error" variant="text" size="small" @click="removeSection(index)" />
          </v-card>
        </template>
      </draggable>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="secondary" variant="outlined" prepend-icon="mdi-plus" class="mt-4">
            Szekció hozzáadása
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="type in componentTypes" :key="type" @click="addSection(type)">
            <v-list-item-title>{{ type }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-card-actions class="mt-10">
        <v-btn color="grey" variant="text" @click="router.back()">Mégse</v-btn>
        <v-spacer />
        <v-btn 
          color="success" 
          size="large" 
          variant="elevated" 
          :loading="isSaving"
          @click="saveLeadMagnet"
        >
          {{ isEdit ? 'Változások mentése' : 'Létrehozás és Szerkesztés' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import draggable from 'vuedraggable'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const seoTab = ref('hu')
const isSaving = ref(false)
const componentTypes = ['Hero', 'HtmlText', 'ImageText', 'Separator', 'Contact', 'Feedback', 'Subscribe']
// 1. Reaktiv form állapot
const form = ref({
  name: '',
  slug: '',
  seo: {
    hu: { title: '', description: '' },
    en: { title: '', description: '' },
    de: { title: '', description: '' }
  },
  sections: []
})

const isEdit = computed(() => !!route.query.id || !!route.query.slug)
const existingKeys = ref(new Set()) // Itt tároljuk a már létező szekciókat

// 2. Betöltés szerkesztés esetén
onMounted(async () => {
  const slug = route.query.slug
  if (!slug) return

  try {
    const res = await $fetch(`/api/leadmagnet/by-slug/${slug}`)
    if (res?.item) {
      form.value = res.item
      res.item.sections.forEach(s => existingKeys.value.add(s.key))
    }
  } catch (err) {
    console.error("Hiba a betöltéskor:", err)
  }
})


const addSection = (type) => {
  const slugPart = form.value.slug || 'new'
  const uniqueKey = `lm-${slugPart}-${type.toLowerCase()}-${Date.now()}`
  form.value.sections.push({ type, key: uniqueKey, props: {} })
}

const removeSection = (index) => form.value.sections.splice(index, 1)

// 3. Mentés és Intelligens Dummy generálás
const saveLeadMagnet = async () => {
  if (!form.value.slug) return alert("A Slug kötelező!")
  if (isEdit.value) {
    form.value.sections.forEach(sec => {
      // Ha a kulcs végén lévő időbélyeg frissült, de az adatbázisban még a régi van,
      // az admin felület ne írja felül új időbélyeggel a meglévő szekciókat!
      console.log(`Szekció ellenőrzése mentés előtt: ${sec.key}`);
    });
  }
  
  isSaving.value = true
  try {
    // 1. Lead Magnet alapstruktúra mentése
    const endpoint = isEdit.value ? `/api/leadmagnet/admin/${form.value._id}` : '/api/leadmagnet/create'
    const savedRes = await $fetch(endpoint, {
      method: isEdit.value ? 'PUT' : 'POST',
      body: form.value
    })

    // Ha most hoztuk létre, szükségünk lehet az ID-ra a továbbiakhoz
    if (!isEdit.value && savedRes?.item?._id) {
      form.value._id = savedRes.item._id
    }

    const languages = ['hu', 'en', 'de']

    // 2. Szekciók inicializálása SORBAN
for (const section of form.value.sections) {
  for (const lang of languages) {
    try {
      // 1. LÉPÉS: Megnézzük, hogy létezik-e már tartalom ehhez a szekcióhoz és nyelvhez
      // A specifikációd alapján a lekérési végpont: /content/[section]/language.get.ts
      // (Ha nem /content/, hanem /api/content/, akkor írd vissza az /api-t)
      const existingContent = await $fetch(`/content/${section.key}/${lang}`, {
        method: 'GET'
      }).catch(() => null) // Ha 404 vagy hiba van, null-al tér vissza

      // 2. LÉPÉS: Csak akkor küldünk dummy adatot, ha a tartalom valóban MÉG NEM LÉTEZIK
      if (!existingContent || (existingContent && !existingContent.title)) {
        console.log(`[INIT] Új szekció inicializálása dummy adattal: ${section.key} (${lang})`);
        
        let dummyData = {
          title: `Új ${section.type}`,
          subtitle: "Szerkeszd ezt a szöveget...",
          paragraphs: ["Tartalom helye..."],
          html: "<p>Kezdj el gépelni...</p>",
          image: "/uploads/placeholder.jpg",
          ctaText: "Kattints ide",
          ctaLink: "#"
        }

        if (section.type === 'Subscribe') {
          dummyData.title = lang === 'hu' ? "Kérlek ad meg az email címed, hogy küldhessem az ingyenes anyagokat!" : "Please enter your email to receive the free materials!";
          dummyData.buttonText = lang === 'hu' ? "Kérem az ingyenes anyagokat!" : "Get the free materials!";
          dummyData.leadMagnetSlug = form.value.slug;
        }

        // Mentés (Kizárólag akkor, ha üres volt!)
        await $fetch(`/content/${section.key}/${lang}`, {
          method: 'PUT',
          body: dummyData
        })
      } else {
        console.log(`[SKIP] Szekció már létezik, adatok megőrizve: ${section.key} (${lang})`);
      }
    } catch (checkErr) {
      console.error(`Hiba a(z) ${section.key} ellenőrzésekor:`, checkErr);
      // Biztonsági fallback: ha az ellenőrzés elhasal, inkább ne írjuk felül az adatot!
    }
  }
}

    // Ha minden kész, csak akkor navigálunk el
    router.push(`/lp/${form.value.slug}`)
  } catch (err) {
    console.error("Részletes hiba:", err); // Most már látni fogod a konzolon a valódi hibát!
    alert(`Hiba történt a mentés során! Részletek a konzolon.`);
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.ghost { opacity: 0.5; background: #c8ebfb; }
.cursor-move { cursor: move; }
</style>