const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const token = getCookie(event, 'jwt')
  const { id } = event.context.params!

  return $fetch(`${backendBase}/meta/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
})
