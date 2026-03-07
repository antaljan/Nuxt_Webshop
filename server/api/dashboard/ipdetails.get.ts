// server/api/dashboard/ipdetails.get.ts
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  const query = getQuery(event) // Tartalmazza az 'ip' és 'date' paramétereket

  return await $fetch(`${backendBase}/dashboard/ipdetails`, {
    headers: { Authorization: `Bearer ${token}` },
    params: query
  })
})