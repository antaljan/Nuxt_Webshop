<template>
  <div class="flex justify-center items-center py-4 bg-gray-50 border-b">
    <span :class="!modelValue ? 'font-bold text-blue-600' : 'text-gray-400'">
      {{ $t('admin.newsletter.campaigns') }}
    </span>

    <v-switch
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      inset
      color="primary"
      hide-details
      class="mx-4"
    />

    <span :class="modelValue ? 'font-bold text-blue-600' : 'text-gray-400'">
      {{ $t('admin.newsletter.subscribers') }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean
})
defineEmits(['update:modelValue'])
</script>
