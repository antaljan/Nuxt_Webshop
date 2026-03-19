export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const slug = getRouterParam(event, 'slug')

  // Itt nincs szükség Tokenre, mert ez a publikus nézet
  return $fetch(`${backendBase}/questionnaire/public/${slug}`, {
    method: 'GET'
  })
})