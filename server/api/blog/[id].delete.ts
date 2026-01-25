const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')
  const { id } = event.context.params!

  return $fetch(`${backendBase}/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
})
