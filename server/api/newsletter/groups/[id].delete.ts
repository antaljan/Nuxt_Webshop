// server/api/newsletter/groups/[id].delete.ts

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  const { id } = event.context.params!

  return await $fetch(
    `${config.public.backendBase}/newsletter/groups/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
})