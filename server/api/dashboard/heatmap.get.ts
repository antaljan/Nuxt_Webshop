export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')
  return await $fetch(`${backendBase}/dashboard/heatmap`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
