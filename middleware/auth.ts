export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()

  // Public sites
  const publicRoutes = ['/', '/login', '/register']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Protected sites
  const isProtected =
    to.path.startsWith('/user') ||
    to.path.startsWith('/admin')

  if (!isProtected) return

  // Try to load user if the status not logged in
  if (!loggedIn.value) {
    await fetchUser()
  }

  // If user is still not loaded → redirect to login
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})