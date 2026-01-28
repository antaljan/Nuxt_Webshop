// server/api/user/product/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') // safer id retrieval
  const config = useRuntimeConfig()
  const backend = config.public.backendBase

  try {
    return await $fetch(`${backend}/user/product/${id}`, {
      headers: {
        cookie: getHeader(event, 'cookie') || ''
      }
    })
  } catch (e) {
    throw createError({
      statusCode: e.response?.status || 500,
      message: 'Backend connection failed'
    })
  }
})
