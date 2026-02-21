export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')
  return await $fetch(`${backendBase}/dashboard/top-templates`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
