export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Meghívjuk a saját Express backend login endpointodat
  const backendRes = await $fetch('http://localhost:4000/user/login', {
    method: 'POST',
    body
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
    maxAge: 60 * 60 * 6 // 6 óra
  })

  // A user objektumot visszaadjuk a frontendnek
  return { user: backendRes.user }
})
