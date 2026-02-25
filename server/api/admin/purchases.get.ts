// server/api/admin/purchases.get.ts
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
    const purchases = await $fetch(`${config.public.backendBase}/admin/purchases/getall`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return purchases
  } catch (err) {
    console.error('Failed to get purchases:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get purchases'
    })
  }
})
