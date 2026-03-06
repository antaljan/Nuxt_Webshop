// server/api/freebie/admin/list.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // A cookie neve nálad 'auth_token' vagy 'jwt', ellenőrizd!
    const token = getCookie(event, 'jwt')

  try {
    return await $fetch(`${config.public.backendBase}/freebie/admin/list`, {
      method: 'GET',
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Nem sikerült lekérni a listát',
    })
  }
})