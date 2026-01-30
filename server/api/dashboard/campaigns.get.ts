export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  // Itt a dashboard/campaigns-t hívjuk, mert ott van a számolási logika!
  return await $fetch(`${config.public.backendBase}/dashboard/campaigns`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
})
