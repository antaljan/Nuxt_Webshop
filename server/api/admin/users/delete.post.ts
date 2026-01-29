export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    return await $fetch(`${config.public.backendBase}/user/delete`, {
      method: 'POST',
      body
    })
  } catch (error) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'User delete failed'
    })
  }
})