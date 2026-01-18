import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const backendRes = await $fetch(`${BACKEND_BASE_URL}/user/login`, {
    method: 'POST',
    body: {
      email: body.email,
      psw: body.password
    }
  })

  if (!backendRes.success) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  // JWT cookie beállítása
  setCookie(event, 'jwt', backendRes.token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 6
  })

  return {
    success: true,
    user: backendRes.user
  }
})
