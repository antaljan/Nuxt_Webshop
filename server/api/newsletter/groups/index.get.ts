// server/api/newsletter/groups/index.get.ts

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  return await $fetch(
    `${config.public.backendBase}/newsletter/groups`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
})