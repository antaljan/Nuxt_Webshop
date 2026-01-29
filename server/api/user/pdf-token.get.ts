export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const token = getCookie(event, 'jwt') // Itt 'jwt'!

  return await $fetch(`${config.public.backendBase}/user/pdf-token`, {
    params: query,
    headers: {
      cookie: `jwt=${token}` // Átadjuk a backendnek a sütit
    }
  })
})
