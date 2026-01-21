export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)

  const loggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const fetchUser = async () => {
    if (process.server) return
    loading.value = true
    try {
      const data = await $fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      })
      // Csak akkor írjuk felül, ha tényleg kaptunk usert
      if (data?.user) {
        user.value = data.user
      }
      // ❗ Ha nincs user a válaszban, NEM nullázzuk le
    } catch (err) {
      console.warn('fetchUser failed, keeping existing user:', err)
      // ❗ Hibára sem nullázzuk le a usert
    } finally {
      loading.value = false
    }
  }



  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      // Ha a backend visszaadja a usert → beállítjuk
      if (data.user) {
        user.value = data.user
      } else {
        // Client oldalon újra lekérjük
        await fetchUser()
      }

      return true
    } catch {
      throw new Error('Login failed')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return {
    user,
    loading,
    loggedIn,
    isAdmin,
    login,
    logout,
    fetchUser
  }
}
