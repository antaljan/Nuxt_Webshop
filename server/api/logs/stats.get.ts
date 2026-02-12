// server/api/logs/stats.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const query = getQuery(event)

  return await $fetch(`${config.public.backendBase}/logs/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    query
  })
})
