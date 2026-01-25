const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const { date } = event.context.params!
  return $fetch(`${backendBase}/booking/${date}`)
})
