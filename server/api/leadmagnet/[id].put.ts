export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const id = event.context.params.id
  const body = await readBody(event)

  return await $fetch(`${config.public.backendBase}/leadmagnet/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body
  })
})
