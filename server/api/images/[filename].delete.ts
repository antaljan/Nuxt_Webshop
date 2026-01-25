const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler((event) => {
  const { filename } = event.context.params!
  return $fetch(`${backendBase}/images/${filename}`, {
    method: 'DELETE'
  })
})
