import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler((event) => {
  const { date } = event.context.params!
  return $fetch(`${BACKEND_BASE_URL}/booking/${date}`)
})
