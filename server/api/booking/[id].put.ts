const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody(event)

  return $fetch(`${backendBase}/booking/${id}`, {
    method: 'PUT',
    body
  })
})
