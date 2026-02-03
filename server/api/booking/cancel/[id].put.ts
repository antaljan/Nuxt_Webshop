export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const id = getRouterParam(event, 'id')

  return await $fetch(`${config.public.backendBase}/booking/cancel/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
