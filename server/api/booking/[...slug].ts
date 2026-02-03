// server/api/booking/[...slug].ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')
  
  // A kérés metódusa (GET, POST, stb.)
  const method = event.method 
  // A kérés törzse (ha van)
  const body = method !== 'GET' ? await readBody(event).catch(() => undefined) : undefined
  // Az útvonal vége (pl. 'all' vagy 'new')
  const slug = event.context.params?.slug

  return await $fetch(`${backendBase}/booking/${slug}`, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
