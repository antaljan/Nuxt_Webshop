<template>
  <v-data-table
    :headers="headers"
    :items="campaigns"
    :loading="loading"
    hover
  >
    <template #item.subject="{ item }">
      <a href="#" @click.prevent="$emit('preview', item)" class="text-blue-600 font-medium">
        {{ item.subject }}
      </a>
    </template>
  </v-data-table>
</template>

<script setup>
defineProps({
  campaigns: Array,
  loading: Boolean
})

const headers = [
  { title: 'Cím', key: 'subject' },
  { title: 'Dátum', key: 'sendDate' },
  { title: 'Megnyitás (%)', key: 'openRate' },
  { title: 'Kattintás (%)', key: 'clickRate' },
  { title: 'Top Link', key: 'topLink' }
]

defineEmits(['preview'])
</script>
