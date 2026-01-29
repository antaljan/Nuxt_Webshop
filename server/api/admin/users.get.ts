export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    return await $fetch(`${config.public.backendBase}/user/get`, {
      method: 'POST',
      headers: {
        cookie: getRequestHeader(event, 'cookie') || ''
      }
    })
  } catch (error: any) {
    console.error('User list proxy error:', error)
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: 'User list fetch failed'
    })
  }
})