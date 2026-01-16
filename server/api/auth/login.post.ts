export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const backendRes = await $fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    body
  })

  // JWT cookie beállítása
  setCookie(event, 'jwt', backendRes.token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  return { user: backendRes.user }
})
