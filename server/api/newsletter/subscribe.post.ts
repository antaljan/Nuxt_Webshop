// subscribe.post.ts
const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return $fetch(`${backendBase}/newsletter/subscribe`, {
    method: 'POST',
    body
  })
})
