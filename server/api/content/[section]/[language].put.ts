import { BACKEND_BASE_URL } from '../../../../utils/backend'

export default defineEventHandler(async (event) => {
  const { section, language } = event.context.params!
  const token = getCookie(event, 'token')
  const body = await readBody(event)

  return $fetch(`${BACKEND_BASE_URL}/content/${section}/${language}`, {
    method: 'PUT',
    body,
    headers: { Authorization: `Bearer ${token}` }
  })
})
