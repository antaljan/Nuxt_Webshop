<script setup lang="ts">
const route = useRoute()

const { data, pending, error } = await useFetch(
  `/api/admin/purchases/${route.params.id}`
)

const purchase = computed(() => data.value?.purchase)
const user = computed(() => data.value?.user)
const items = computed(() => data.value?.items || [])
</script>

<template>
  <v-container>
    <v-btn variant="text" color="primary" to="/admin/purchases">
      ← Vissza a listához
    </v-btn>

    <h1 class="text-h5 mb-4">Vásárlás részletei</h1>

    <v-row>
      <!-- Purchase meta -->
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <h2 class="text-h6 mb-2">Vásárlás</h2>
          <p><strong>ID:</strong> {{ purchase?._id }}</p>
          <p><strong>Dátum:</strong> {{ new Date(purchase?.createdAt).toLocaleString() }}</p>
          <p><strong>Összeg:</strong> {{ (purchase?.amount / 100).toFixed(2) }} €</p>
          <p><strong>Stripe Session:</strong> {{ purchase?.stripeSessionId }}</p>
        </v-card>
      </v-col>

      <!-- User info -->
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <h2 class="text-h6 mb-2">Vásárló</h2>
          <p><strong>Név:</strong> {{ user?.firstname }} {{ user?.name }}</p>
          <p><strong>Email:</strong> {{ user?.email }}</p>
          <p><strong>Cím:</strong> {{ user?.adress }}</p>
          <p><strong>Nyelv:</strong> {{ user?.language }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Items -->
    <v-card class="pa-4 mt-4">
      <h2 class="text-h6 mb-4">Tételek</h2>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Termék neve</th>
            <th class="text-left">Termék ID</th>
            <th class="text-left">Mennyiség</th>
            <th class="text-left">Egységár (EUR)</th>
            <th class="text-left">Összeg (EUR)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item._id }}</td>
            <td>1</td>
            <td>{{ (item.price).toFixed(2) }}</td>
            <td>{{ (item.price).toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>
      <!-- Összesítő blokk -->
      <v-divider class="my-4"></v-divider>
      <div class="text-right">
        <p class="text-h6">
          <strong>Fizetett végösszeg:</strong>
          {{ (purchase?.amount / 100).toFixed(2) }} €
        </p>
      </div>
    </v-card>

  </v-container>
</template>
