export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  const body = await readBody(event)

  if (!body._id || !body.subject || !body.blocks) {
    throw createError({
      statusCode: 400,
      data: { error: "Missing fields (_id, subject, blocks)" }
    })
  }

  return await $fetch(`${config.public.backendBase}/newsletter/update`, {
    method: 'PUT',
    body,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
