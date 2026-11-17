export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()

  const slug = getQuery(event).slug

  return await $fetch(
    `${config.public.backendBase}/page/by-path`,
    {
      query: {
        slug
      }
    }
  )

})