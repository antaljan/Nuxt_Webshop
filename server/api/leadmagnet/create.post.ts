export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const body = await readBody(event)

  return await $fetch(`${config.public.backendBase}/leadmagnet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body
  })
})
