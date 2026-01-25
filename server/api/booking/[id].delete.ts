const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const { id } = event.context.params!
  return $fetch(`${backendBase}/booking/${id}`, {
    method: 'DELETE'
  })
})
