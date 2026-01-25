const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const { emailId } = event.context.params!
  const query = getQuery(event)

  return sendRedirect(
    event,
    `${backendBase}/track/click/${emailId}?url=${encodeURIComponent(
      String(query.url || '')
    )}`
  )
})
