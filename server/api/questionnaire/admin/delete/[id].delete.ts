export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')
  const id = getRouterParam(event, 'id')

  return $fetch(`${backendBase}/questionnaire/admin/delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})