import { BACKEND_BASE_URL } from '../../../utils/backend'

export default defineEventHandler((event) => {
  const { filename } = event.context.params!
  return $fetch(`${BACKEND_BASE_URL}/images/${filename}`, {
    method: 'DELETE'
  })
})
