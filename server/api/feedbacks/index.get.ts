import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(() => {
  return $fetch(`${BACKEND_BASE_URL}/feedbacks`)
})
