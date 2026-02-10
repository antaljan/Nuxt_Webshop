<template>
  <section class="p-10 max-w-5xl mx-auto">

    <h1 class="text-3xl font-bold mb-8">
      {{ t('admin.products.listTitle') }}
    </h1>

    <div class="flex items-center justify-between mb-6">
      <NuxtLink
        to="/admin/products/create"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + {{ t('admin.products.new') }}
      </NuxtLink>

      <!-- SEARCH -->
      <input
        v-model="search"
        type="text"
        class="border rounded px-3 py-2 w-64"
        :placeholder="t('common.search')"
      />
    </div>

    <!-- SORT + FILTER -->
    <div class="flex gap-6 mb-6">

      <!-- SORT -->
      <div>
        <label class="block text-sm font-semibold mb-1">
          {{ t('common.sortBy') }}
        </label>
        <select v-model="sortBy" class="border rounded px-3 py-2">
          <option value="title_asc">{{ t('common.titleAZ') }}</option>
          <option value="title_desc">{{ t('common.titleZA') }}</option>
          <option value="price_asc">{{ t('common.priceLowHigh') }}</option>
          <option value="price_desc">{{ t('common.priceHighLow') }}</option>
        </select>
      </div>

      <!-- PRICE FILTER -->
      <div>
        <label class="block text-sm font-semibold mb-1">
          {{ t('common.priceRange') }}
        </label>
        <div class="flex gap-2">
          <input
            v-model.number="minPrice"
            type="number"
            class="border rounded px-3 py-2 w-24"
            placeholder="Min"
          />
          <input
            v-model.number="maxPrice"
            type="number"
            class="border rounded px-3 py-2 w-24"
            placeholder="Max"
          />
        </div>
      </div>

      <!-- LANGUAGE FILTER -->
      <div>
        <label class="block text-sm font-semibold mb-1">
          {{ t('admin.products.language') }}
        </label>
        <select v-model="languageFilter" class="border rounded px-3 py-2">
          <option value="all">{{ t('common.all') }}</option>
          <option value="hu">Magyar</option>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </div>

    </div>

    <!-- TABLE -->
    <v-table class="mt-4">
      <thead>
        <tr>
          <th>{{ t('admin.products.listTitle') }}</th>
          <th>{{ t('admin.products.price') }}</th>
          <th>{{ t('admin.products.language') }}</th>
          <th class="text-right">{{ t('admin.products.actions') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in paginated" :key="p._id">
          <td>{{ p.title }}</td>
          <td>€{{ p.price }}</td>
          <td>{{ p.language }}</td>

          <td class="text-right space-x-4">
            <NuxtLink
              :to="`/admin/products/create?edit=${p._id}`"
              class="text-blue-600 hover:underline"
            >
              {{ t('admin.products.edit') }}
            </NuxtLink>

            <button
              class="text-red-600 hover:underline"
              @click="confirmDelete(p._id)"
            >
              {{ t('admin.products.delete') }}
            </button>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- PAGINATION -->
    <div class="flex justify-center mt-6 gap-4">
      <button
        class="px-3 py-1 border rounded"
        :disabled="page === 1"
        @click="page--"
      >
        ‹
      </button>

      <span class="px-4 py-1">
        {{ page }} / {{ totalPages }}
      </span>

      <button
        class="px-3 py-1 border rounded"
        :disabled="page === totalPages"
        @click="page++"
      >
        ›
      </button>
    </div>

  </section>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useProductsAdmin } from '~/composables/useProductsAdmin'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { loggedIn, isAdmin } = useAuth()
if (!loggedIn.value || !isAdmin.value) navigateTo('/login')

const admin = useProductsAdmin()
const languageFilter = ref('all')


/* ---------------------------
   AUTH GUARD
--------------------------- */
// SSR guard
if (!loggedIn.value || !isAdmin.value) {
  navigateTo('/login', { replace: true })
}
// Client guard
watchEffect(() => {
  if (!loggedIn.value || !isAdmin.value) {
    navigateTo('/login', { replace: true })
  }
})

// Fetch products
const { data, refresh } = await useAsyncData('admin-products', () =>
  admin.getAllProducts()
)

const products = computed(() => data.value || [])

/* ---------------------------
   SEARCH / FILTER / SORT
--------------------------- */
const search = ref('')
const sortBy = ref('title_asc')
const minPrice = ref(null)
const maxPrice = ref(null)

/* ---------------------------
   FILTERED + SORTED LIST
--------------------------- */
const filtered = computed(() => {
  let list = [...products.value]
  // LANGUAGE FILTER
  if (languageFilter.value !== 'all') {
    list = list.filter(p => p.language === languageFilter.value)
  }

  // SEARCH
  if (search.value) {
    const s = search.value.toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(s))
  }

  // PRICE FILTER
  if (minPrice.value != null) {
    list = list.filter(p => p.price >= minPrice.value)
  }
  if (maxPrice.value != null) {
    list = list.filter(p => p.price <= maxPrice.value)
  }

  // SORTING
  switch (sortBy.value) {
    case 'title_asc':
      list.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title_desc':
      list.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'price_asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      list.sort((a, b) => b.price - a.price)
      break
  }

  return list
})

/* ---------------------------
   PAGINATION
--------------------------- */
const page = ref(1)
const perPage = 10

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage))
)

watch(filtered, () => {
  page.value = 1
})

const paginated = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

/* ---------------------------
   DELETE
--------------------------- */
async function confirmDelete(id) {
  if (!confirm(t('admin.products.confirmDelete'))) return

  await admin.deleteProduct(id)
  await refresh()
}
</script>