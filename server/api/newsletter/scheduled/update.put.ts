const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  const body = await readBody(event)

  return $fetch(`${backendBase}/newsletter/scheduled/update`, {
    method: 'PUT',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
