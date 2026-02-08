export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    return await $fetch(`${config.public.backendBase}/brand`)
  } catch (err) {
    console.error('Failed to load brand settings:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load brand settings'
    })
  }
})
