export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const slug = event.context.params.slug

  return await $fetch(`${config.public.backendBase}/leadmagnet/${slug}/convert`, {
    method: 'POST'
  })
})
