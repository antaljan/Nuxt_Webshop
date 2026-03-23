export const useAuth = () => {
  // A useState megmarad, ez szinkronizálja az állapotot a szerver és kliens között
  const user = useState<any>('user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)

  const loggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

// useAuth.ts
const fetchUser = async () => {
  // Ha már van user, és nem kényszerített frissítés, ne csináljunk semmit 
  // (megakadályozza a villogást és a véletlen nullázást)
  if (user.value && !process.server) return 

  loading.value = true
  try {
    const headers = useRequestHeaders(['cookie'])
    const data = await $fetch<any>('/api/auth/me', { headers })

    if (data?.user) {
      user.value = data.user
    } else {
      // Csak akkor nullázzuk, ha a backend kifejezetten mondja (pl. 401)
      user.value = null
    }
  } catch (err: any) {
    // Ha 401 (Unauthorized), akkor tényleg nincs belépve
    if (err.response?.status === 401) {
      user.value = null
    }
    // Minden más hiba (hálózat, 500) esetén MEGTARTJUK a jelenlegi user-t!
  } finally {
    loading.value = false
  }
}


  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const data = await $fetch<any>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (data?.user) {
        user.value = data.user
      } else {
        await fetchUser()
      }
      return true
    } catch (e) {
      throw new Error('Login failed')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  const register = async (email, password) => {
    try {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { email, password }
      })
      await fetchUser()
      return data
    } catch (e) {
      throw e
    }
  }

  return {
    user,
    loading,
    loggedIn,
    isAdmin,
    login,
    logout,
    fetchUser,
    register
  }
}
