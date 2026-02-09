<template>
  <section class="p-6 max-w-4xl mx-auto">
    <!--  back to user dashboard  -->
    <NuxtLink
      to="/user"
      class="inline-flex items-center text-sm text-blue-600 hover:underline mb-4"
    >
      {{ $t('products.backToDashboard') }}
    </NuxtLink>
    <!--  Title  -->
    <h1 class="text-3xl font-bold mb-6">{{ $t('products.yourproducts') }}</h1>
    <!--  place holder for longer loading or error -->
    <div v-if="pending" class="text-gray-500">{{ $t('products.loading') }}</div>
    <div v-else-if="error" class="text-red-600">
      {{ $t('products.error') }}
    </div>
    <!--  no product  -->
    <div v-else-if="!purchases.length" class="text-gray-500">
      {{ $t('products.noProducts') }}
    </div>
    <!--  List cards view  -->
    <div v-else class="grid gap-6">
      <div
          v-for="p in purchases"
          :key="p._id"
          class="border rounded-lg shadow p-4 flex gap-4"
        >
          <img
          v-if="p.items[0]?.cover"
          :src="p.items[0].cover"
          class="w-32 h-32 object-cover rounded"
        />
        <div class="flex-1">
          <h2 class="text-xl font-semibold">
            {{ p.items[0].title }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ p.items[0].shortDescription }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Purchased: {{ new Date(p.createdAt).toLocaleDateString() }}
          </p>
          <NuxtLink
            :to="`/user/product/${p._id}`"
            class="inline-block mt-3 text-blue-600 hover:underline"
          >
            {{ $t('products.open') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

definePageMeta({
  middleware: 'auth'
})

// Fetch purchases using proxy endpoint
const { data, pending, error } = await useAsyncData(
  'user-products',
  async () => {
    return await $fetch('/api/user/purchases', {
      headers: useRequestHeaders(['cookie'])
    })
  }
)

const purchases = computed(() => {
  const rawList = data.value?.purchases || data.value || [];
  
  // Csoportosítás a termék címe alapján, hogy ne legyen duplikáció
  const uniqueProducts = [];
  const seenTitles = new Set();

  rawList.forEach(p => {
    const title = p.items[0]?.title;
    if (title && !seenTitles.has(title)) {
      seenTitles.add(title);
      uniqueProducts.push(p);
    }
  });

  return uniqueProducts;
});
</script>
