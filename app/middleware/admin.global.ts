export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchMe } = useAuth()

  if (!user.value) {
    await fetchMe()
  }

  if (!user.value || user.value.role !== 'admin') {
    if (to.path.startsWith('/admin')) {
      return navigateTo('/')
    }
  }
})
