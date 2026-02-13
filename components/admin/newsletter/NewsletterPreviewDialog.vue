<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="800px"
  >
    <v-card rounded="xl">
      <v-card-title class="bg-blue-darken-3 text-white py-4 px-6">
        {{ campaign?.subject }}
      </v-card-title>

      <v-card-text class="pa-0 bg-white min-h-[400px]">
        <div v-html="template?.rawcontent" class="p-4"></div>
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
defineProps({
  modelValue: Boolean,
  campaign: Object,
  template: Object
})

defineEmits(['update:modelValue'])
</script>
