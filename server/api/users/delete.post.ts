const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  const body = await readBody(event)

  return $fetch(`${backendBase}/user/delete`, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
