import { BACKEND_BASE_URL } from '../../../utils/backend'

export default defineEventHandler((event) => {
  const { emailId } = event.context.params!
  const query = getQuery(event)

  return sendRedirect(
    event,
    `${BACKEND_BASE_URL}/track/click/${emailId}?url=${encodeURIComponent(
      String(query.url || '')
    )}`
  )
})
