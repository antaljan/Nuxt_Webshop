export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const date = getRouterParam(event, 'date') // Várható formátum: YYYY-MM-DD

  return await $fetch(`${config.public.backendBase}/booking/by-date/${date}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
