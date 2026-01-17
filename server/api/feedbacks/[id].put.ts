import { BACKEND_BASE_URL } from '../../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const { id } = event.context.params!
  const body = await readBody(event)

  return $fetch(`${BACKEND_BASE_URL}/feedbacks/${id}`, {
    method: 'PUT',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
