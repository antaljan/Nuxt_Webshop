export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')

if (!token) {
  return { user: null }
}

  const user = await $fetch('http://localhost:4000/user/get', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })

  return { user }
})
