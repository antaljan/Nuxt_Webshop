<template>
  <section class="p-10 max-w-4xl mx-auto">

    <!-- TITLE -->
    <h1 class="text-3xl font-bold mb-8">
      {{ isEdit ? 'Edit Blog Post' : 'Create New Blog Post' }}
    </h1>

    <!-- FORM -->
    <v-form ref="form" v-model="valid" lazy-validation>

      <!-- TITLE -->
      <v-text-field
        v-model="post.title"
        label="Title"
        :rules="[v => !!v || 'Title is required']"
        @input="generateSlug"
        class="mb-4"
      />

      <!-- SUBTITLE -->
      <v-text-field
        v-model="post.subtitle"
        label="Subtitle"
        class="mb-4"
      />

      <!-- AUTHOR -->
      <v-text-field
        v-model="post.author"
        label="Author"
        :rules="[v => !!v || 'Author is required']"
        class="mb-4"
      />

      <!-- SLUG -->
      <v-text-field
        v-model="post.slug"
        label="Slug"
        :rules="[v => !!v || 'Slug is required']"
        class="mb-4"
      />

      <!-- IMAGE UPLOAD -->
      <div class="mb-6">
        <label class="font-semibold block mb-2">Image</label>

        <input type="file" @change="uploadImage" />

        <div v-if="post.image" class="mt-4">
          <v-img :src="post.image" height="200" class="rounded-xl" />
        </div>
      </div>

      <!-- CONTENT -->
      <label class="font-semibold block mb-2">Content</label>
      <label class="font-semibold block mb-2">Content</label>
      <EditorContent :editor="editor" class="border rounded-lg p-4 bg-white" />

      <!-- ACTIONS -->
      <div class="flex gap-4 mt-8">
        <v-btn
          color="blue"
          @click="savePost"
          :disabled="!valid"
        >
          {{ isEdit ? 'Update Post' : 'Create Post' }}
        </v-btn>

        <NuxtLink
          to="/admin/blog"
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </NuxtLink>
      </div>

    </v-form>

  </section>
</template>

<script setup>
import { useBlog } from '~/composables/useBlog'
import { useRoute, useRouter } from '#imports'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

/* ---------------------------
   create Tiptap Editor
--------------------------- */

const editor = ref(null)
onMounted(() => {
  editor.value = new Editor({
    content: post.content,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      post.content = editor.getHTML()
    }
  })
})
onBeforeUnmount(() => {
  editor.value?.destroy()
})


/* ---------------------------
   ROUTE + ROUTER
--------------------------- */
const route = useRoute()
const router = useRouter()

/* ---------------------------
   BLOG COMPOSABLE
--------------------------- */
const blog = useBlog()

/* ---------------------------
   EDIT MODE?
--------------------------- */
const isEdit = computed(() => !!route.query.edit)
const postId = computed(() => route.query.edit)

/* ---------------------------
   FORM STATE
--------------------------- */
const valid = ref(false)

const post = reactive({
  title: '',
  subtitle: '',
  author: '',
  slug: '',
  image: '',
  content: ''
})

/* ---------------------------
 LOAD EXISTING POST (EDIT MODE) 
--------------------------- */
if (isEdit.value) {
  const { data } = await useAsyncData(
    `admin-edit-post-${postId.value}`,
    () => blog.getPost(postId.value)   // <-- FIX
  )

  if (data.value) {
    Object.assign(post, data.value)
  }
}


/* ---------------------------
   SLUG GENERATOR
--------------------------- */
function generateSlug() {
  if (!isEdit.value) {
    post.slug = post.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

/* ---------------------------
   IMAGE UPLOAD
--------------------------- */
async function uploadImage(event) {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  const res = await $fetch(`${backendBase}/upload`, {
    method: 'POST',
    body: formData
  })

  post.image = res.url
}

/* ---------------------------
   SAVE POST
--------------------------- */
async function savePost() {
  if (!valid.value) return

  if (isEdit.value) {
    await blog.updatePost(postId.value, post)
  } else {
    await blog.createPost(post)
  }

  router.push('/admin/blog')
}
</script>
