import { BACKEND_BASE_URL } from '../../../../utils/backend'

export default defineEventHandler((event) => {
  const { email } = event.context.params!
  return $fetch(`${BACKEND_BASE_URL}/newsletter/unsubscribe/${email}`)
})
