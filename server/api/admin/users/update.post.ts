export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  try {
    return await $fetch(`${config.public.backendBase}/user/update`, {
      method: 'POST',
      body,
      headers: token
      ? { Authorization: `Bearer ${token}` }   // FIXED
      : {}
    })
  } catch (error) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'User update failed'
    })
  }
})