// server/api/admin/purchases/[id]/refund.post.ts
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

    const result = await $fetch(`${config.public.backendBase}/admin/purchases/${id}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return result
  } catch (err) {
    console.error('Refund failed:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Refund failed'
    })
  }
})
