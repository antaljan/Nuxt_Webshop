<template>
  <section class="p-10 max-w-4xl mx-auto">
    <!-- TITLE -->
    <h1 class="text-3xl font-bold mb-8 text-blue-darken-3">
      {{ isEdit ? $t('admin.blog.editTitle') : $t('admin.blog.createTitle') }}
    </h1>

    <!-- FORM -->
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <!-- TITLE -->
        <v-col cols="12" md="8">
          <v-text-field
            v-model="post.title"
            :label="$t('admin.blog.form.title')"
            variant="outlined"
            :rules="[v => !!v || 'Title is required']"
            @input="generateSlug"
            class="mb-2"
          />
        </v-col>

        <!-- DATE PICKER -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="post.date"
            :label="$t('admin.blog.form.date')"
            type="date"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
            :rules="[v => !!v || 'Date is required']"
            class="mb-2"
          />
        </v-col>
      </v-row>

      <!-- SUBTITLE -->
      <v-text-field
        v-model="post.subtitle"
        :label="$t('admin.blog.form.subtitle')"
        variant="outlined"
        class="mb-4"
      />

      <v-row>
        <!-- AUTHOR -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="post.author"
            :label="$t('admin.blog.form.author')"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            :rules="[v => !!v || 'Author is required']"
            class="mb-4"
          />
        </v-col>

        <!-- SLUG -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="post.slug"
            :label="$t('admin.blog.form.slug')"
            variant="outlined"
            prepend-inner-icon="mdi-link"
            :rules="[v => !!v || 'Slug is required']"
            class="mb-4"
          />
        </v-col>
      </v-row>

      <!-- IMAGE UPLOAD -->
      <div class="mb-6 p-4 border rounded-lg bg-grey-lighten-4">
        <label class="font-semibold block mb-2 text-subtitle-1">{{ $t('admin.blog.form.image') }}</label>
        <input type="file" accept="image/*" @change="uploadImage" class="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        
        <div v-if="post.image" class="mt-4 relative">
          <v-img :src="post.image" height="250" cover class="rounded-xl shadow-lg" />
          <v-btn icon="mdi-close" size="small" color="red" class="absolute top-2 right-2" @click="post.image = ''"></v-btn>
        </div>
      </div>

      <!-- CONTENT EDITOR -->
      <label class="font-semibold block mb-2 text-subtitle-1">{{ $t('admin.blog.form.content') }}</label>
      <div class="editor-wrapper border rounded-lg p-2 bg-white min-h-[300px]">
        <EditorContent :editor="editor" />
      </div>

      <!-- ACTIONS -->
      <div class="flex gap-4 mt-10">
        <v-btn
          color="blue-darken-2"
          size="large"
          elevation="2"
          @click="savePost"
          :disabled="!valid"
          prepend-icon="mdi-content-save"
        >
          {{ isEdit ?  $t('admin.blog.actions.update') : $t('admin.blog.actions.create') }}
        </v-btn>

        <v-btn
          variant="outlined"
          size="large"
          to="/admin/blog"
          prepend-icon="mdi-cancel"
        >
          {{ $t('common.cancel') }}
        </v-btn>
      </div>
    </v-form>
  </section>
</template>

<script setup>
import { useBlog } from '~/composables/useBlog'
import { useAuth } from '~/composables/useAuth'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

/* ---------------------------
    i18n & AUTH
--------------------------- */
const { locale } = useI18n()
const { isAdmin, loggedIn } = useAuth()
const route = useRoute()
const router = useRouter()
const blog = useBlog()
const config = useRuntimeConfig()

// Client-side Guard
onMounted(() => {
  if (!loggedIn.value || !isAdmin.value) {
    navigateTo('/login')
  }
})

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
  content: '',
  date: new Date().toISOString().split('T')[0] // Default: Today
})

const isEdit = computed(() => !!route.query.edit)
const postId = computed(() => route.query.edit)

/* ---------------------------
    TIPTAP EDITOR
--------------------------- */
const editor = ref(null)

onMounted(() => {
  editor.value = new Editor({
    content: post.content,
    extensions: [StarterKit],
    onUpdate: ({ editor: e }) => {
      post.content = e.getHTML()
    }
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

/* ---------------------------
  LOAD DATA (EDIT MODE)
--------------------------- */
if (isEdit.value) {
  const { data } = await useAsyncData(`edit-post-${postId.value}`, () => 
    blog.getPost(postId.value)
  )
  if (data.value) {
    Object.assign(post, data.value)
    // Update editor content after data load
    setTimeout(() => {
      editor.value?.commands.setContent(post.content)
    }, 100)
  }
}

/* ---------------------------
    LOGIC FUNCTIONS
--------------------------- */
function generateSlug() {
  if (!isEdit.value) {
    post.slug = post.title
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eltávolítja az ékezeteket
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

async function uploadImage(event) {
  const file = event.target.files[0]
  
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await $fetch(`${config.public.backendBase}/upload`, {
      method: 'POST',
      body: formData
    })
    post.image = config.public.backendBase + res.path
    //console.log(post.image)
  } catch (err) {
    console.error("Image upload failed", err)
  }
}

async function savePost() {
  if (!valid.value) return

  const finalPayload = {
    ...post,
    language: locale.value
  }

  try {
    if (isEdit.value) {
      await blog.updatePost(postId.value, finalPayload)
    } else {
      await blog.createPost(finalPayload)
    }
    router.push('/admin/blog')
  } catch (error) {
    console.error("Error saving post:", error.data || error)
    alert("Mentési hiba! Ellenőrizd a konzolt.")
  }
}
</script>

<style scoped>
:deep(.tiptap) {
  outline: none;
  min-height: 250px;
}
:deep(.tiptap p) {
  margin-bottom: 1em;
}
</style>
