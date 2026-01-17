import { BACKEND_BASE_URL } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  if (!token) return { user: null }

  // 1) JWT dekódolása
  const decoded = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  )

  const userId = decoded.id

  // 2) Backend: összes user lekérése
  const users = await $fetch(`${BACKEND_BASE_URL}/user/get`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })

  // 3) Kiválasztjuk a bejelentkezett usert
  const me = users.find((u: any) => u._id === userId)

  return { user: me || null }
})
