export default defineEventHandler(async (event) => {

  console.log('BY-PATH PROXY HIT')

  const config = useRuntimeConfig()

  const slug = getQuery(event).slug

  console.log('PROXY SLUG:', slug)

  console.log(
    'BACKEND BASE:',
    config.public.backendBase
  )

  console.log('PROXY SLUG:', slug)

  return await $fetch(
    `${config.public.backendBase}/page/by-path`,
    {
      query: {
        slug
      }
    }
  )

})