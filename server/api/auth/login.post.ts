const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const backendRes = await $fetch(`${backendBase}/user/login`, {
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
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 6
  })

  return {
    success: true,
    user: {
      ...backendRes.user,
      _id: backendRes.user._id.toString()
    }
  }
})
