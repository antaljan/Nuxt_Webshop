import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // A backend psw-t vár, nem password-öt
  const payload = {
    email: body.email,
    psw: body.password   // vagy body.psw, ha úgy küldöd
  }

  const response = await $fetch(`${BACKEND_BASE_URL}/user/login`, {
    method: 'POST',
    body: payload
  })

  return response
})
