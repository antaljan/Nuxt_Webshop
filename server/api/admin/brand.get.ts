// frontend/server/api/admin/brand.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  if (!token) {
    return { error: 'Unauthorized', settings: null }
  }

  try {
    const settings = await $fetch(`${config.public.backendBase}/brand`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return settings
  } catch (err) {
    console.error('Failed to load brand settings:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load brand settings'
    })
  }
})
