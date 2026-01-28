export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    // Weiterleitung an deinen Express-Backend /user/create
    return await $fetch(`${config.public.backendBase}/user/create`, {
      method: 'POST',
      body
    })
  } catch (error) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Registrierung fehlgeschlagen'
    })
  }
})
