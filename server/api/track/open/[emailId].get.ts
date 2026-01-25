const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const { emailId } = event.context.params!
  return $fetch(`${backendBase}/track/open/${emailId}`)
})
