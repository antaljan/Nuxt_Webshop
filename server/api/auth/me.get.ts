const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  if (!token) return { user: null }

  // JWT dekódolása
  const decoded = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  )

  // decoded = { id, email, role }

  return {
    user: decoded
  }
})

/*export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  if (!token) return { user: null }

  // 1) JWT dekódolása
  const decoded = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  )

  const userId = decoded.id

  // 2) Backend: összes user lekérése
  const users = await $fetch(`${backendBase}/user/get`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })

  // 3) Kiválasztjuk a bejelentkezett usert
  const me = users.find((u: any) => u._id === userId)

  return { user: me || null }
})
*/