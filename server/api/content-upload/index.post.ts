import { BACKEND_BASE_URL } from '../../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const form = await readMultipartFormData(event)

  return $fetch(`${BACKEND_BASE_URL}/content-upload`, {
    method: 'POST',
    body: form as any,
    headers: { Authorization: `Bearer ${token}` }
  })
})
