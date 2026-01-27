export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()

  // Public oldalak
  const publicRoutes = ['/', '/login', '/register']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Protected oldalak
  const isProtected =
    to.path.startsWith('/user') ||
    to.path.startsWith('/admin')

  if (!isProtected) return

  // Ha még nem töltöttük be a usert → egyszer próbáld meg
  if (!loggedIn.value) {
    await fetchUser()
  }

  // Ha továbbra sincs user → login
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})