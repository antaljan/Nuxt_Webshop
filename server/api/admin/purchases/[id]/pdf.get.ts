export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'jwt')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const id = getRouterParam(event, 'id')

  // FONTOS: fetch, nem $fetch
  const response = await fetch(`${config.public.backendBase}/admin/purchases/${id}/pdf`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const arrayBuffer = await response.arrayBuffer()

  return new Response(arrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf'
    }
  })
})

