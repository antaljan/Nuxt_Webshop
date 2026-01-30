export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const body = await readBody(event)

  // Ellenőrizzük az Express backend elvárásait
  return await $fetch(`${config.public.backendBase}/newsletter/save`, {
    method: 'POST',
    body: {
      subject: body.subject,
      rawcontent: body.fullHtml, // Átnevezés az Express-nek
      structure: body.structure,
      sendDate: body.sendDate
    },
    headers: { Authorization: `Bearer ${token}` }
  })
})
