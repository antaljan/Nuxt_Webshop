<template>
  <v-data-table
    :headers="headers"
    :items="subscribers"
    :loading="loading"
    hover
  >
    <template #item.actions="{ item }">
      <v-icon size="small" class="mr-2" color="blue" @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon size="small" color="red" @click="$emit('delete', item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script setup>
defineProps({
  subscribers: Array,
  loading: Boolean
})

const headers = [
  { title: 'Vezetéknév', key: 'name' },
  { title: 'Keresztnév', key: 'firstname' },
  { title: 'Email', key: 'email' },
  { title: 'Nyelv', key: 'language' },
  { title: 'Műveletek', key: 'actions', sortable: false }
]

defineEmits(['edit', 'delete'])
</script>
