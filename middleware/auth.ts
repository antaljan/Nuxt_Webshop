export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetchUser } = useAuth()

  // 1. Ha publikus oldal, nem csinálunk semmit
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password']
  if (publicRoutes.includes(to.path)) return

  // 2. Ha védett oldalra tart (user/admin)
  const isProtected = to.path.startsWith('/user') || to.path.startsWith('/admin')
  if (!isProtected) return

  // 3. KRITIKUS: Mindig próbáljuk frissíteni a felhasználót, ha nincs bent
  // vagy ha épp most jövünk a loginról, hogy biztosak legyünk az állapotban
  if (!loggedIn.value) {
    await fetchUser()
  }

  // 4. Ha még mindig nincs bent -> Irány a login, de mentsük el, hova akart menni!
  if (!loggedIn.value) {
    // encodeURIComponent kell, hogy a speciális karakterek (pl. /) ne törjék meg a URL-t
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
