const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const { section, language } = event.context.params!
  return $fetch(`${backendBase}/content/${section}/${language}`)
})
