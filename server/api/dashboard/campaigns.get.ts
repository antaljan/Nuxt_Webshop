import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')

  return $fetch(`${BACKEND_BASE_URL}/dashboard/campaigns`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
