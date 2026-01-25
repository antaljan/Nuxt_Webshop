const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(() => {
  return $fetch(`${backendBase}/booking/all`)
})
