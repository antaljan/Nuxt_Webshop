const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')

  await $fetch(`${backendBase}/user/logout`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })

  deleteCookie(event, 'jwt', { path: '/' })
  return { success: true }
})
