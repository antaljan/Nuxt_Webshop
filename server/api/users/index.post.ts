const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')

  return $fetch(`${backendBase}/user/get`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
})
