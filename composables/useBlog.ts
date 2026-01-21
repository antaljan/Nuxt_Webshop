// useBlog.ts
import { useI18n } from 'vue-i18n'

export function useBlog() {
  const { locale } = useI18n()
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  /* -----------------------------------------
     GET ALL POSTS (SSR + i18n aware)
  ----------------------------------------- */
  async function getPosts() {
    return await $fetch(`${backendBase}/posts`, {
      params: {
        language: locale.value
      }
    })
  }

  /* -----------------------------------------
     GET ONE POST BY SLUG
  ----------------------------------------- */
  async function getPostBySlug(slug: string) {
  return await $fetch(`${backendBase}/posts/slug/${slug}`, {
    params: { language: locale.value }
  })
}

  /* -----------------------------------------
     ADMIN: CREATE POST
  ----------------------------------------- */
  async function createPost(payload: any) {
    return await $fetch(`${backendBase}/posts/create`, {
      method: 'POST',
      body: payload
    })
  }

  /* -----------------------------------------
     ADMIN: UPDATE POST
  ----------------------------------------- */
  async function updatePost(id: string, payload: any) {
    return await $fetch(`${backendBase}/posts/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  /* -----------------------------------------
     ADMIN: DELETE POST
  ----------------------------------------- */
  async function deletePost(id: string) {
    return await $fetch(`${backendBase}/posts/${id}`, {
      method: 'DELETE'
    })
  }

  /* -----------------------------------------
     GET ONE POST BY id
  ----------------------------------------- */
  async function getPost(id) {
    return $fetch(`${backendBase}/posts/${id}`)
  }


  return {
    getPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    getPost
  }
}
