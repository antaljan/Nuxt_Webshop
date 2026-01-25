const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')

  return $fetch(`${backendBase}/dashboard/campaigns`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
