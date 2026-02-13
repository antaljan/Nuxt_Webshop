<template>
    <v-dialog
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        max-width="500px"
    >

    <v-card rounded="xl">
      <v-card-title class="bg-blue-darken-3 text-white py-4 px-6">
        {{ isEdit ? 'Feliratkozó szerkesztése' : 'Új feliratkozó' }}
      </v-card-title>

      <v-card-text class="pt-6">
        <v-text-field v-model="subscriber.name" label="Vezetéknév" />
        <v-text-field v-model="subscriber.firstname" label="Keresztnév" />
        <v-text-field v-model="subscriber.email" label="Email" :disabled="isEdit" />

        <v-select
          v-model="subscriber.group"
          :items="['ujjonc', 'torzsvasarlo', 'coach']"
          label="Csoport"
        />

        <v-select
          v-model="subscriber.language"
          :items="languages"
          item-title="title"
          item-value="value"
          label="Nyelv"
        />
      </v-card-text>

      <v-card-actions class="pa-4 bg-gray-50">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Mégse</v-btn>
        <v-btn color="primary" @click="$emit('save', subscriber)">
          Mentés
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  subscriber: Object,
  languages: Array
})

defineEmits(['update:modelValue', 'save'])
</script>
