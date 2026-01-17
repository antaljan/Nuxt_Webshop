import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')

  await $fetch(`${BACKEND_BASE_URL}/user/logout`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })

  deleteCookie(event, 'jwt', { path: '/' })
  return { success: true }
})
