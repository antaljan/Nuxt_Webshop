// server/api/newsletter/groups/index.post.ts

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  const body = await readBody(event)

  return await $fetch(
    `${config.public.backendBase}/newsletter/groups`,
    {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
})