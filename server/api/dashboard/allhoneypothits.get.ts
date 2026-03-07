// server/api/dashboard/allhoneypothits.get.ts
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  const query = getQuery(event)

  return await $fetch(`${backendBase}/dashboard/allhoneypothits`, {
    headers: { Authorization: `Bearer ${token}` },
    params: query
  })
})