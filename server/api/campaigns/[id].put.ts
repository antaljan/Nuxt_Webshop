const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  const id = event.context.params!.id
  const body = await readBody(event)

  return $fetch(`${backendBase}/campaigns/${id}`, {
    method: 'PUT',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
