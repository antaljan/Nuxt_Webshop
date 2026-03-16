import { defineEventHandler } from '#imports'
import { getHeader, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backend = config.public.backendBase
  const query = getQuery(event)

  // LOGOLÁS a Nitro konzolba (VS Code terminal)
  console.log('PDF Proxy - Kapott adatok:', query)

  try {
    // A videó mintájára: a teljes cookie header-t átadjuk
    return await $fetch(`${backend}/user/pdf-token`, {
      headers: {
        cookie: getHeader(event, 'cookie') || ''
      },
      // Kényszerítsük a query-t
      query: {
        purchaseId: query.purchaseId,
        file: query.file
      }
    })
  } catch (error) {
    console.error('PDF Proxy hiba:', error.response?._data || error.message)
    return createError({
      statusCode: error.response?.status || 500,
      message: 'Backend hívás sikertelen (PDF-Token)'
    })
  }
})