export const useAuth = () => {
  const user = useState<any>('user', () => null)

  // Computed: be van-e jelentkezve
  const loggedIn = computed(() => !!user.value)

  // Backend: /api/auth/login
  const login = async (email: string, password: string) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    user.value = data
  }

  // Backend: /api/auth/logout
  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  // Backend: /api/auth/me
  const fetchUser = async () => {
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data
    } catch (err) {
      user.value = null
    }
  }

  return {
    user,
    loggedIn,
    login,
    logout,
    fetchUser
  }
}
