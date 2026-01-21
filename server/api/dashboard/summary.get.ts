import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'jwt')   // <-- FIX

  return $fetch(`${BACKEND_BASE_URL}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
