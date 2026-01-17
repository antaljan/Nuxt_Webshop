export const useAuth = () => {
  const user = useState<any>('user', () => null)
  const loggedIn = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })

    if (data.success) {
      user.value = data.user
    } else {
      throw new Error('Login failed')
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  const fetchUser = async () => {
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data.user
    } catch {
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
