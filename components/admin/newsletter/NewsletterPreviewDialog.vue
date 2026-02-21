<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800px"
  >
    <v-card rounded="xl">
      <v-card-title class="bg-blue-darken-3 text-white py-4 px-6">
        {{ template?.subject || campaign?.name }}
      </v-card-title>

      <v-card-text class="pa-0 bg-white min-h-[400px]">
        <div class="p-4" v-html="renderedHtml"></div>
      </v-card-text>

      <v-card-actions class="bg-gray-50 pa-4">
        <v-spacer />
        <v-btn color="primary" variant="tonal" @click="$emit('update:modelValue', false)">
          Bezárás
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { renderNewsletterPreview } from '~/utils/newsletter/render'

const props = defineProps({
  modelValue: Boolean,
  campaign: Object,
  template: Object
})

defineEmits(['update:modelValue'])

const renderedHtml = computed(() => {
  if (!props.template?.blocks) return "<p>Nincs megjeleníthető tartalom</p>"
  return renderNewsletterPreview({
    blocks: props.template.blocks,
    subscriber: { firstname: "Barátom" }
  })
})
</script>
