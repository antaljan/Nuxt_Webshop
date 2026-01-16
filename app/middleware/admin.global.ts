export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser } = useAuth()

  if (!user.value) {
    await fetchUser()
  }

  if (!user.value || user.value.role !== 'admin') {
    if (to.path.startsWith('/admin')) {
      return navigateTo('/')
    }
  }
})
