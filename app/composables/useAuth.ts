export const useAuth = () => {
  const user = useState('user', () => null)
  const loggedIn = computed(() => !!user.value)

  async function login(email, psw) {
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: { email, psw }
    })

    if (error.value) throw error.value

    user.value = data.value.user
  }

async function fetchUser() {
  if (user.value !== null) return  // már be van töltve

  const { data } = await useFetch('/api/auth/me')

  user.value = data.value?.user || null
}


  async function logout() {
    await useFetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, loggedIn, login, logout, fetchUser }
}
