const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  const id = event.context.params!.id

  return $fetch(`${backendBase}/campaigns/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
})
