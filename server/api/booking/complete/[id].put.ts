// server/api/booking/complete/[id].put.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const { id } = event.context.params

  try {
    return await $fetch(`${config.public.backendBase}/booking/complete/${id}`, {
      method: 'PUT',
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Booking complete failed'
    })
  }
})
