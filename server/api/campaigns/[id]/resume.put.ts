const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  const id = event.context.params!.id

  return $fetch(`${backendBase}/campaigns/${id}/resume`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
})
