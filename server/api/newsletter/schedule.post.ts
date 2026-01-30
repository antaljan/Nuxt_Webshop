// schedule.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const body = await readBody(event)

  try {
    return await $fetch(`${config.public.backendBase}/newsletter/send`, {
      method: 'POST',
      body: body,
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    })
  } catch (error: any) {
    // Falls das Backend einen Fehler wirft, loggen wir ihn im Nuxt-Terminal
    console.error("Backend Error Details:", error.data)
    throw error
  }
})
