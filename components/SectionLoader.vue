<script setup>
const props = defineProps(['sectionKey', 'type'])
const { locale } = useI18n()

// Automatikusan frissül, ha nyelvet váltunk!
const { data: content, refresh } = await useAsyncData(
  `content-${props.sectionKey}-${locale.value}`,
  () => $fetch(`/api/content/${props.sectionKey}/${locale.value}`)
)

// Ha az admin nyelvet vált, töltsük újra az adatot
watch(locale, () => refresh())

// Resolve component logic...
import GenericHeroSection from './GenericHeroSection.vue'
// ... többi import
</script>

<template>
  <div class="section-container">
    <component
      v-if="content"
      :is="resolvedComponent"
      :content="content"
      :sectionKey="sectionKey"
    />
    <div v-else-if="isAdmin" class="pa-10 border-dashed text-center">
      Nincs tartalom ehhez a szekcióhoz ezen a nyelven ({{ locale }}).
      Kattints a létrehozáshoz!
    </div>
  </div>
</template>