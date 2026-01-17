import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  // A feltöltött fájlok olvasása
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  // A backend multipart form-data-t vár
  const backendForm = new FormData()
  for (const field of formData) {
    backendForm.append(field.name, field.data, field.filename)
  }

  // Továbbküldés a backend felé
  const response = await $fetch(`${BACKEND_BASE_URL}/content-upload`, {
    method: 'POST',
    body: backendForm,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response
})
