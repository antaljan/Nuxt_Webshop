const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const token = getCookie(event, 'jwt')   // <-- FIX

  return $fetch(`${backendBase}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
