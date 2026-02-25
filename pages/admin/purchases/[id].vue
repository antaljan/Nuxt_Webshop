<script setup lang="ts">
const route = useRoute()

const { data, pending, error } = await useFetch(
  `/api/admin/purchases/${route.params.id}`
)

const purchase = computed(() => data.value?.purchase)
const user = computed(() => data.value?.user)
const items = computed(() => data.value?.items || [])


async function refundPurchase() {
  try {
    await $fetch(`/api/admin/purchases/${purchase.value._id}/refund`, {
      method: 'POST'
    })
    alert('Refund sikeres!')
  } catch (err) {
    alert('Refund sikertelen!')
  }
}

async function downloadPdf() {
  const response = await fetch(`/api/admin/purchases/${purchase.value._id}/pdf`)
  const blob = await response.blob()

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `invoice-${purchase.value._id}.pdf`
  a.click()
  window.URL.revokeObjectURL(url)
}



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
            <th>#</th>
            <th>Termék neve</th>
            <th>Termék ID</th>
            <th>Mennyiség</th>
            <th>Nettó ár (EUR)</th>
            <th>ÁFA %</th>
            <th>ÁFA összeg (EUR)</th>
            <th>Bruttó ár (EUR)</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in items" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item._id }}</td>
            <td>1</td>

            <!-- Nettó ár -->
            <td>{{ item.price.toFixed(2) }}</td>

            <!-- ÁFA % -->
            <td>0%</td>

            <!-- ÁFA összeg -->
            <td>0.00</td>

            <!-- Bruttó ár -->
            <td>{{ item.price.toFixed(2) }}</td>
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
      <p v-if="purchase?.refund?.refunded">
        <strong>Refund státusz:</strong>
        Visszatérítve ({{ new Date(purchase.refund.refundedAt).toLocaleString() }})
      </p>
    </v-card>

    <!-- PDF download button-->
    <v-divider class="my-4"></v-divider>
    <v-btn
      color="primary"
      variant="tonal"
      @click="downloadPdf"
    >
      PDF letöltése
    </v-btn>
    <v-divider class="my-4"></v-divider>
    <!--  Refund button -->
    <v-btn
      v-if="!purchase?.refund?.refunded"
      color="error"
      variant="tonal"
      @click="refundPurchase"
    >
      Visszatérítés (elállás esetén)
    </v-btn>

  </v-container>
</template>
