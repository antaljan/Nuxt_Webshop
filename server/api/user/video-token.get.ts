import { defineEventHandler } from '#imports'
import { getHeader, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backend = config.public.backendBase

  // Az összes query paramétert (pl. purchaseId) egyben kiszedjük
  const query = getQuery(event)

  try {
    return await $fetch(`${backend}/user/video-token`, {
      headers: {
        cookie: getHeader(event, 'cookie') || ''
      },
      // params HELYETT query kell a ?purchaseId=... formátumhoz
      query: query 
    })
  } catch (error) {
    // Érdemes lekezelni a hibát, hogy ne omoljon össze az SSR
    return createError({
      statusCode: error.response?.status || 500,
      message: 'Backend hívás sikertelen'
    })
  }
})
