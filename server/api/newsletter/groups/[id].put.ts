// server/api/newsletter/groups/[id].put.ts

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  const { id } = event.context.params!
  const body = await readBody(event)

  return await $fetch(
    `${config.public.backendBase}/newsletter/groups/${id}`,
    {
      method: 'PUT',
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
})