import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')

  return $fetch(`${BACKEND_BASE_URL}/user/get`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
})
