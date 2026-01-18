export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()

  const isProtected =
    to.path.startsWith('/user') ||
    to.path.startsWith('/admin')

  // Public route → nincs teendő
  if (!isProtected) {
    return
  }

  // Ha még nincs user betöltve → próbáljuk meg
  if (!loggedIn.value) {
    await fetchUser()
  }

  // Ha továbbra sincs user → login
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
