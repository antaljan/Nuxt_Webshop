// server/api/coaching/jitsi-token/[id].get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const token = getCookie(event, 'jwt') // A HTTP-only cookie-dból vesszük ki

  try {
    // Továbbítás az Express backend felé (pl. port 4000)
    return await $fetch(`${config.public.backendBase}/coaching/jitsi-token/${id}`, {
      method: 'GET',
      headers: {
        // Átadjuk a JWT-t az Express authenticateToken middleware-nek
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Jitsi token fetch failed'
    })
  }
})
