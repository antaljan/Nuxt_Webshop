export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')
  const questionnaireId = getRouterParam(event, 'id')

  return $fetch(`${backendBase}/questionnaire/admin/responses/${questionnaireId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})