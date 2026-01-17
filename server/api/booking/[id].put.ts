import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody(event)

  return $fetch(`${BACKEND_BASE_URL}/booking/${id}`, {
    method: 'PUT',
    body
  })
})
