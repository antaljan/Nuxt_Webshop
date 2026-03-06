// server/api/freebie/admin/create.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase // pl. https://antaligyongyi.hu/backend
  
  // 1. Token kinyerése (vagy cookie-ból, vagy az Authorization headerből)
    const token = getCookie(event, 'jwt')

  // 2. Mivel fájlfeltöltésről van szó (multipart/form-data), 
  // nem olvassuk be a body-t JSON-ként (readBody), hanem átadjuk a nyers adatot.
  const formData = await readRawBody(event, false) 
  const contentType = getHeader(event, 'content-type')

  try {
    return await $fetch(`${backendBase}/freebie/admin/create`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': contentType // Átadjuk a boundary-t is!
      }
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Backend Proxy Error',
      data: error.data
    })
  }
})