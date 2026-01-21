<template>
  <section class="p-10">

    <!-- TITLE + CREATE BUTTON -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Blog Posts</h1>

      <NuxtLink
        to="/admin/blog/create"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + New Post
      </NuxtLink>
    </div>

    <!-- LOADING -->
    <div v-if="pending" class="text-gray-500">Loading...</div>

    <!-- ERROR -->
    <div v-else-if="error" class="text-red-500">Error loading posts</div>

    <!-- EMPTY -->
    <div v-else-if="posts.length === 0" class="text-gray-500">
      No posts found.
    </div>

    <!-- TABLE -->
    <v-table v-else>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Date</th>
          <th>Slug</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td>{{ post.title }}</td>
          <td>{{ post.author }}</td>
          <td>{{ formatDate(post.date || post.createdAt) }}</td>
          <td>{{ post.slug }}</td>

          <td class="space-x-3">

            <!-- EDIT -->
            <NuxtLink
              :to="`/admin/blog/create?edit=${post._id}`"
              class="text-blue-600 hover:underline"
            >
              Edit
            </NuxtLink>

            <!-- DELETE -->
            <button
              class="text-red-600 hover:underline"
              @click="confirmDelete(post._id)"
            >
              Delete
            </button>

          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- BACK TO HOME BUTTON -->
    <div class="mt-10">
      <NuxtLink
        to="/"
        class="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
      >
        ← Back to Home
      </NuxtLink>
    </div>
    
  </section>
</template>

<script setup>
import { useBlog } from '~/composables/useBlog'

  /*-----------------------------------
        Admin Auth Guard
  ---------------------------------- */
const { isAdmin, loggedIn } = useAuth()
// Client oldali guard
onMounted(() => {
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
// Ha kilépsz → automatikusan redirectel
watch([loggedIn, isAdmin], () => {
  if (!loggedIn.value) {
    navigateTo('/')
  } else if (!isAdmin.value) {
    navigateTo('/')
  }
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
   POSTS
--------------------------- */
const posts = computed(() => Array.isArray(data.value) ? data.value : [])

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
  if (!confirm('Are you sure you want to delete this post?')) return

  await blog.deletePost(id)
  await refresh()
}
</script>
