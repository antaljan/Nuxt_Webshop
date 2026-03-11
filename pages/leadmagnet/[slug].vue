<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const { data } = await useFetch(`/api/leadmagnet/${route.params.slug}`)

const resolveComponent = (type) => {
  switch (type) {
    case 'hero': return GenericHeroSection;
    case 'text': return GenericTextSection;
    case 'imageText': return GenericImageTextSection;
    case 'feedback': return GenericFeedbackSection;
    case 'contact': return GenericContactSection;
    default: return SectionSeparator;
  }
};
</script>

<template>
  <div v-if="data?.item">
    <component
      v-for="(section, i) in data.item.sections"
      :key="i"
      :is="resolveComponent(section.type)"
      v-bind="section.props"
    />
  </div>
</template>
