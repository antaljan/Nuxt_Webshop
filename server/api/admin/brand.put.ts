// frontend/server/api/admin/brand.put.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  if (!token) {
    return { error: 'Unauthorized', settings: null }
  }

  const body = await readBody(event)

  try {
    const updated = await $fetch(`${config.public.backendBase}/brand`, {
      method: 'PUT',
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return updated
  } catch (err) {
    console.error('Failed to update brand settings:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update brand settings'
    })
  }
})
