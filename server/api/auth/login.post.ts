import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await $fetch(`${BACKEND_BASE_URL}/user/login`, {
    method: 'POST',
    body
  })

  // assuming backend returns { token, user }
  const { token, user } = response as any

  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/'
  })

  return user
})
