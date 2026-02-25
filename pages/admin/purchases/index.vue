<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/admin/purchases')

const purchases = computed(() => data.value?.purchases || [])
</script>

<template>
  <v-container>
    <h1 class="text-h5 mb-4">Vásárlások</h1>

    <v-btn variant="text" color="primary" to="/admin">
      ← Vissza a Dashboardra
    </v-btn>

    <v-card>
      <v-data-table
        :items="purchases"
        :loading="pending"
        :headers="[
          { title: 'Dátum', key: 'createdAt' },
          { title: 'Név', key: 'user.name' },
          { title: 'Cím', key: 'user.adress' },
          { title: 'Termékek', key: 'itemsCount' },
          { title: 'Összeg', key: 'amount' },
          { title: 'Pénznem', key: 'currency' },
          { title: 'Művelet', key: 'actions', sortable: false }
        ]"
      >
        <template #item.createdAt="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
        </template>

        <template #item.user.name="{ item }">
          {{ item.user?.firstname }} {{ item.user?.name }}
        </template>

        <template #item.amount="{ item }">
          {{ (item.amount / 100).toFixed(2) }} €
        </template>

        <template #item.actions="{ item }">
          <v-btn
            color="primary"
            variant="tonal"
            :to="`/admin/purchases/${item.purchaseId}`"
          >
            Részletek
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
