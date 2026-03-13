// server/api/leadmagnet/[slug].get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Próbáljuk meg kinyerni a slug-ot a paraméterekből
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slug parameter',
    })
  }

  console.log('Fetching leadmagnet for slug:', slug) // Debughoz

  return await $fetch(`${config.public.backendBase}/leadmagnet/${slug}`, {
    method: 'GET'
  })
})
