const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {

  const { section } = event.context.params!

  const token = getCookie(
    event,
    'jwt'
  )

  return $fetch(
    `${backendBase}/content/${section}`,
    {
      method: 'DELETE',

      headers: token
        ? {
            Authorization:
              `Bearer ${token}`
          }
        : {}
    }
  )

})