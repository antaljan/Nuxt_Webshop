export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const body = await readBody(event)

  // Opcionálisan hozzáadhatunk metadata-t (IP, User-Agent) a kutatáshoz
  const metadata = {
    userAgent: getHeader(event, 'user-agent'),
    platform: getHeader(event, 'sec-ch-ua-platform') || 'unknown'
  }

  return $fetch(`${backendBase}/questionnaire/submit`, {
    method: 'POST',
    body: {
      ...body,
      metadata
    }
  })
})