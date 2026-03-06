// server/api/freebie/admin/[id].delete.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
    const token = getCookie(event, 'jwt')

  try {
    return await $fetch(`${config.public.backendBase}/freebie/admin/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Hiba a törlés során',
    })
  }
})