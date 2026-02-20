const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')

  return $fetch(`${backendBase}/campaigns`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
})
