<template>
  <section class="p-10 max-w-4xl mx-auto">

    <h1 class="text-3xl font-bold mb-8">Products</h1>

    <NuxtLink
      to="/admin/products/create"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      + New Product
    </NuxtLink>

    <v-table class="mt-8">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p._id">
          <td>{{ p.title }}</td>
          <td>€{{ p.price }}</td>
          <td>
            <NuxtLink :to="`/admin/products/create?edit=${p._id}`">
              Edit
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </v-table>

  </section>
</template>

<script setup>
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

const { data: products } = await useAsyncData(
  'admin-products',
  () => $fetch(`${backendBase}/products`)
)
</script>
