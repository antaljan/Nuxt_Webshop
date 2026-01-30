export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const body = await readBody(event) // Ez olvassa be a { _id: "..." } objektumot

  return await $fetch(`${config.public.backendBase}/newsletter/getonetemplate`, {
    method: 'POST',
    body, // Ezt küldi tovább az Express-nek
    headers: { Authorization: `Bearer ${token}` }
  })
})
