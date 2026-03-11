<script setup>
const { data, refresh } = await useFetch('/api/leadmagnet/all')

const items = computed(() => data.value?.items || [])

const copyLink = (slug) => {
  const url = `${window.location.origin}/leadmagnet/${slug}`
  navigator.clipboard.writeText(url)
}
const deleteItem = async (id) => {
  await $fetch(`/api/leadmagnet/delete/${id}`, { method: 'DELETE' })
  refresh()
}

</script>

<template>
  <v-container>
    <v-row class="d-flex justify-space-between align-center mb-4">
      <h1>Lead Magnetek</h1>
      <v-btn color="primary" to="/admin/leadmagnet/create">Új létrehozása</v-btn>
    </v-row>

    <v-table>
      <thead>
        <tr>
          <th>Cím</th>
          <th>Nyelv</th>
          <th>Megtekintés</th>
          <th>Konverzió</th>
          <th>Konverziós arány</th>
          <th>Link</th>
          <th>Műveletek</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item._id">
          <td>{{ item.title }}</td>
          <td>{{ item.language }}</td>
          <td>{{ item.views }}</td>
          <td>{{ item.conversions }}</td>
          <td>{{ ((item.conversions / item.views) * 100).toFixed(1) }}%</td>

          <td>
            <v-btn size="small" @click="copyLink(item.slug)">másolás</v-btn>
          </td>

          <td>
            <v-btn
              size="small"
              color="primary"
              :to="`/admin/leadmagnet/create?id=${item._id}`"
            >
              szerkesztés
            </v-btn>
            <v-btn size="small" color="error" @click="deleteItem(item._id)">törlés</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
