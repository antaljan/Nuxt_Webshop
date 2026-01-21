export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)

  const loggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const fetchUser = async () => {
    loading.value = true
    try {
      // SSR alatt szükséges → átadjuk a cookie-t
      const headers = useRequestHeaders(['cookie'])

      const data = await $fetch('/api/auth/me', {
        method: 'GET',
        headers
      })

      user.value = data.user || null
    } catch {
      user.value = null
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
        // Ha nem → lekérjük a /me endpointból
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
