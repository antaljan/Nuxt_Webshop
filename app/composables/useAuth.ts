export const useAuth = () => {
  const user = useState<any>('user', () => null)

  const login = async (email: string, password: string) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    user.value = data
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  const fetchMe = async () => {
    const data = await $fetch('/api/auth/me')
    user.value = data
  }

  return { user, login, logout, fetchMe }
}
