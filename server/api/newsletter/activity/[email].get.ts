export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  const { email } = event.context.params!

  return await $fetch(
    `${config.public.backendBase}/newsletter/activity/${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
})