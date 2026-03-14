const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  // A beérkező POST body kiolvasása (keys és lang)
  const body = await readBody(event)

  try {
    // Továbbítás a NODE backend felé
    return await $fetch(`${backendBase}/content/bulk-load`, {
      method: 'POST',
      body: body
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Backend Bulk Load Failed',
    })
  }
})