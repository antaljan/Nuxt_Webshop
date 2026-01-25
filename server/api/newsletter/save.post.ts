const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const body = await readBody(event)

  return $fetch(`${backendBase}/newsletter/save`, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
