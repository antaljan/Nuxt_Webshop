const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const { section, language } = event.context.params!
  const token = getCookie(event, 'jwt')   // FIXED
  const body = await readBody(event)

  return $fetch(`${backendBase}/content/${section}/${language}`, {
    method: 'PUT',
    body,
    headers: token
      ? { Authorization: `Bearer ${token}` }   // FIXED
      : {}
  })
})
