const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const { email } = event.context.params!
  return $fetch(`${backendBase}/users/logs/${id}`)
})
