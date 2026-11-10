// server/api/page/create.post.ts

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const body = await readBody(event)

  return await $fetch(`${config.public.backendBase}/page`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body
  })
})