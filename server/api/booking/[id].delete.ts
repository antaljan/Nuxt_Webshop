import { BACKEND_BASE_URL } from '../../../utils/backend'

export default defineEventHandler((event) => {
  const { id } = event.context.params!
  return $fetch(`${BACKEND_BASE_URL}/booking/${id}`, {
    method: 'DELETE'
  })
})
