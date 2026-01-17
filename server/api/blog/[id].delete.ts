import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'token')
  const { id } = event.context.params!

  return $fetch(`${BACKEND_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
})
