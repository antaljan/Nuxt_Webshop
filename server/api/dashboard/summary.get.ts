export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  
  return await $fetch(`${config.public.backendBase}/dashboard/summary`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
})
