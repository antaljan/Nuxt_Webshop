export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  return await $fetch(`${config.public.backendBase}/booking/available`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
