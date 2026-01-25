const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return $fetch(`${backendBase}/user/create`, {
    method: 'POST',
    body
  })
})
