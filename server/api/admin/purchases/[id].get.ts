// server/api/admin/purchases/[id].get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const id = getRouterParam(event, 'id')

    const purchase = await $fetch(`${config.public.backendBase}/admin/purchases/getone/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return purchase
  } catch (err) {
    console.error('Failed to get purchase details:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get purchase details'
    })
  }
})
