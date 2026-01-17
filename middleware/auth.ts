export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()

  // 1) Csak a protected route-okon fusson
  const isProtected =
    to.path.startsWith('/user') ||
    to.path.startsWith('/admin')

  if (!isProtected) {
    return
  }

  // 2) Ha nincs user betöltve, próbáljuk meg lekérni
  if (!loggedIn.value) {
    try {
      await fetchUser()
    } catch (err) {
      console.error('fetchUser failed:', err)
    }
  }

  // 3) Ha még mindig nincs bejelentkezve → login oldal
  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  // 4) Ha be van jelentkezve és a login oldalra menne → dashboard
  if (loggedIn.value && to.path === '/login') {
    return navigateTo('/user')
  }
})
