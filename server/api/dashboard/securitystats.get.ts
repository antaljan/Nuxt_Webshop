// server/api/dashboard/securitystats.get.ts
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  
  // Lekérjük a query paramétereket (from, to), ha a frontend küldene ilyet
  const query = getQuery(event)

  return await $fetch(`${backendBase}/dashboard/securitystats`, {
    headers: { Authorization: `Bearer ${token}` },
    params: query
  })
})
