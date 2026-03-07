// server/api/dashboard/allsuspiciousips.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')
  const query = getQuery(event)

  console.log('Proxy query:', query) // Ezt nézd meg a VPS konzolján!

  return await $fetch(`${config.public.backendBase}/dashboard/allsuspiciousips`, {
    headers: { Authorization: `Bearer ${token}` },
    query: query // Itt 'query'-t használj 'params' helyett a Nuxt 3/4-ben!
  })
})
