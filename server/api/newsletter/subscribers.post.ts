const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const body = await readBody(event) // if needed

  return $fetch(`${backendBase}/newsletter/subscribers`, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
