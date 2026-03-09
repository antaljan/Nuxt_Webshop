export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  return await $fetch(`${config.public.backendBase}/dashboard/stats/sending-capacity`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
})
