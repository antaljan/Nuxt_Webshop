// server/api/booking/new.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const body = await readBody(event) // Beolvassuk a frontendről érkező JSON-t

  return await $fetch(`${config.public.backendBase}/booking/new`, {
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
