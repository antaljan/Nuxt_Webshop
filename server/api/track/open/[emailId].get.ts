import { BACKEND_BASE_URL } from '../../../../utils/backend'

export default defineEventHandler((event) => {
  const { emailId } = event.context.params!
  return $fetch(`${BACKEND_BASE_URL}/track/open/${emailId}`)
})
