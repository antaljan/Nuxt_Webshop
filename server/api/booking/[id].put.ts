export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return await $fetch(`${config.public.backendBase}/booking/${id}`, {
    method: 'PUT',
    body,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
