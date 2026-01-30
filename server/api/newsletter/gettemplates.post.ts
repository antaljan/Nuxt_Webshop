export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  
  return await $fetch(`${config.public.backendBase}/newsletter/gettemplates`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
})
