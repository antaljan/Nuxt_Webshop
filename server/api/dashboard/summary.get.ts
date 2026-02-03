// server/api/dashboard/summary.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  
  console.log('--- Proxy hívás indítása ---')
  console.log('Token megléte:', !!token)
  console.log('Backend URL:', `${config.public.backendBase}/dashboard/summary`)

  try {
    const data = await $fetch(`${config.public.backendBase}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Backend válasz sikeres!')
    return data
  } catch (error: any) {
    console.error('PROXY HIBA:', error.data || error.message)
    throw createError({
      statusCode: error.response?.status || 500,
      message: 'Backend nem elérhető'
    })
  }
})
