export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  return await $fetch(`${config.public.backendBase}/meta/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})