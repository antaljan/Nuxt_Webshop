import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return $fetch(`${BACKEND_BASE_URL}/booking/new`, {
    method: 'POST',
    body
  })
})
