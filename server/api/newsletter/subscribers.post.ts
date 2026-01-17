import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const body = await readBody(event) // if needed

  return $fetch(`${BACKEND_BASE_URL}/newsletter/subscribers`, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
