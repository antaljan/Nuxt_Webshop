const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const form = await readMultipartFormData(event)

  return $fetch(`${backendBase}/content-upload`, {
    method: 'POST',
    body: form as any,
    headers: { Authorization: `Bearer ${token}` }
  })
})
