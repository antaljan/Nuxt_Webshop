export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth()

  // Csak admin oldalakra fusson
  if (!to.path.startsWith('/admin')) {
    return
  }

  // Ha nincs user betöltve, próbáljuk meg lekérni
  if (!user.value) {
    try {
      await fetchUser()
    } catch (err) {
      console.error('fetchUser failed:', err)
    }
  }

  // Ha nincs user vagy nem admin → redirect
  if (!user.value || user.value.role !== 'admin') {
    return navigateTo('/')
  }
})
