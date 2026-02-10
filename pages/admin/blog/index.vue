<template>
  <section class="p-10">

    <!-- TITLE + CREATE BUTTON -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">
        {{ t('admin.blog.listTitle') }}
      </h1>

      <NuxtLink
        to="/admin/blog/create"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + {{ t('admin.blog.createTitle') }}
      </NuxtLink>
    </div>

    <!-- LANGUAGE FILTER -->
    <div class="flex gap-6 mb-6">
      <div>
        <label class="block text-sm font-semibold mb-1">
          {{ t('admin.blog.language') }}
        </label>

        <select v-model="languageFilter" class="border rounded px-3 py-2">
          <option value="all">{{ t('common.all') }}</option>
          <option value="hu">Magyar</option>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="pending" class="text-gray-500">
      {{ t('blog.loading') }}
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-red-500">
      {{ t('blog.error') }}
    </div>

    <!-- EMPTY -->
    <div v-else-if="posts.length === 0" class="text-gray-500">
      {{ t('blog.empty') }}
    </div>

    <!-- TABLE -->
    <v-table v-else>
      <thead>
        <tr>
          <th>{{ t('admin.blog.form.title') }}</th>
          <th>{{ t('admin.blog.form.author') }}</th>
          <th>{{ t('admin.blog.form.date') }}</th>
          <th>{{ t('admin.blog.form.slug') }}</th>
          <th>{{ t('admin.blog.language') }}</th>
          <th>{{ t('admin.products.actions') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td>{{ post.title }}</td>
          <td>{{ post.author }}</td>
          <td>{{ formatDate(post.date || post.createdAt) }}</td>
          <td>{{ post.slug }}</td>
          <td>{{ post.language }}</td>

          <td class="space-x-3">
            <!-- EDIT -->
            <v-btn
              icon="mdi-pencil"
              size="small"
              :to="`/admin/blog/create?edit=${post._id}`"
            />

            <!-- DELETE -->
            <v-btn
              icon="mdi-delete"
              size="small"
              color="red"
              @click="confirmDelete(post._id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

  </section>
</template>

<script setup>
import { useBlog } from '~/composables/useBlog'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const languageFilter = ref('all')

/*-----------------------------------
      Admin Auth Guard
-----------------------------------*/
const { isAdmin, loggedIn } = useAuth()

onMounted(() => {
  if (!loggedIn.value) return navigateTo('/login')
  if (!isAdmin.value) return navigateTo('/')
})

watch([loggedIn, isAdmin], () => {
  if (!loggedIn.value) navigateTo('/')
  else if (!isAdmin.value) navigateTo('/')
})

/* ---------------------------
   BLOG COMPOSABLE
--------------------------- */
const blog = useBlog()

/* ---------------------------
   SSR FETCH
--------------------------- */
const { data, pending, error, refresh } = await useAsyncData(
  'admin-blog-list',
  () => blog.getPosts()
)

/* ---------------------------
   POSTS + LANGUAGE FILTER
--------------------------- */
const posts = computed(() => {
  const list = Array.isArray(data.value) ? data.value : []
  if (languageFilter.value === 'all') return list
  return list.filter(p => p.language === languageFilter.value)
})

/* ---------------------------
   HELPERS
--------------------------- */
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

/* ---------------------------
   DELETE HANDLER
--------------------------- */
async function confirmDelete(id) {
  if (!confirm(t('admin.blog.actions.deleteConfirm'))) return
  await blog.deletePost(id)
  await refresh()
}
</script>
