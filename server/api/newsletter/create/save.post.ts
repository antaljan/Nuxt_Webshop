// server/api/newsletter/create/save.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  let body
  try {
    body = await readBody(event)
  } catch (e) {
    console.error("Hiba a body beolvasásakor:", e)
    throw createError({ statusCode: 400, message: "A küldött adat nem érvényes JSON" })
  }

  console.log("Kérés érkezett (JSON sablon):", body)

  // ÚJ VALIDÁCIÓ – JSON alapú sablon
  if (!body.subject || !body.blocks) {
    throw createError({
      statusCode: 400,
      data: { error: "Missing fields (subject, blocks)" }
    })
  }

  try {
    return await $fetch(`${config.public.backendBase}/newsletter/save`, {
      method: 'POST',
      body: {
        subject: body.subject,
        language: body.language || "hu",
        blocks: body.blocks
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
