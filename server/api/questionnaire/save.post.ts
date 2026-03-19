export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')
  const body = await readBody(event)

  return $fetch(`${backendBase}/questionnaire/save`, {
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})