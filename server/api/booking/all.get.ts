// server/api/booking/all.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt') // Ellenőrizd a cookie nevedet!

  return await $fetch(`${config.public.backendBase}/booking/all`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
