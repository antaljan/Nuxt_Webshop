// server/api/newsletter/stats/campaign-pareto.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  return await $fetch(`${config.public.backendBase}/dashboard/stats/campaign-pareto`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
})

