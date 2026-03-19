export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')

  return $fetch(`${backendBase}/questionnaire/admin/list`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})