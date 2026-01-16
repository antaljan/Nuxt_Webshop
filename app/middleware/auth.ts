export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()

  // Ha már be van töltve a user, nem kell újra fetch-elni
  if (!loggedIn.value) {
    await fetchUser()
  }

  // Ha nincs bejelentkezve és NEM a login oldalon vagy
  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Ha be van jelentkezve és a login oldalra menne → irány a dashboard
  if (loggedIn.value && to.path === '/login') {
    return navigateTo('/user')
  }
})
