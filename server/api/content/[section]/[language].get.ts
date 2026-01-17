import { BACKEND_BASE_URL } from '../../../../utils/backend'

export default defineEventHandler((event) => {
  const { section, language } = event.context.params!
  return $fetch(`${BACKEND_BASE_URL}/content/${section}/${language}`)
})
