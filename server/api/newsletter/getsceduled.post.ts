import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const body = await readBody(event)

  return $fetch(`${BACKEND_BASE_URL}/newsletter/getsceduled`, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
