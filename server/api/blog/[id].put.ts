const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const { id } = event.context.params!
  const body = await readBody(event)

  return $fetch(`${backendBase}/posts/${id}`, {
    method: 'PUT',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
