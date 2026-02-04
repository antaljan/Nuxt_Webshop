// frontend/server/api/auth/me.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  if (!token) return { user: null }

  try {
    // Felhívunk a Node.js backendre a valódi adatokért
    const userData = await $fetch(`${config.public.backendBase}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return { user: userData }
  } catch (e) {
    return { user: null }
  }
})