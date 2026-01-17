import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)

  return $fetch(`${BACKEND_BASE_URL}/upload`, {
    method: 'POST',
    body: form as any
  })
})
