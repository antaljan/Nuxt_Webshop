// server/api/newsletter/create/save.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  
  // A readBody-t try-catch-be tesszük, hogy lássuk, ha ott akad el
  let body
  try {
    body = await readBody(event)
  } catch (e) {
    console.error("Hiba a body beolvasásakor:", e)
    throw createError({ statusCode: 400, message: "A küldött adat nem érvényes JSON" })
  }

  // Ha ide eljut, látni fogod a terminálban!
  console.log("Kérés érkezett, subject:", body?.subject)

  try {
    return await $fetch(`${config.public.backendBase}/newsletter/save`, {
      method: 'POST',
      body: {
        subject: body.subject,
        rawcontent: body.fullHtml,
        sendDate: body.sendDate,
        structure: body.structure
      },
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    })
  } catch (error: any) {
    console.error("Backend hiba:", error.data || error.message)
    throw createError({
      statusCode: error.response?.status || 500,
      data: error.data
    })
  }
})
