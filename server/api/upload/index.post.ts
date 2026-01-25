const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)

  return $fetch(`${backendBase}/upload`, {
    method: 'POST',
    body: form as any
  })
})
