export default defineNuxtRouteMiddleware(async (to) => {
  const { user, isAdmin, fetchUser } = useAuth()

  // Csak admin route-okon fusson
  if (!to.path.startsWith('/admin')) {
    return
  }

  // Ha nincs user betöltve → próbáljuk meg lekérni
  if (!user.value) {
    await fetchUser()
  }

  // Ha nincs user vagy nem admin → redirect
  if (!isAdmin.value) {
    return navigateTo('/')
  }
})
