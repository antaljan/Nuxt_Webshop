import { defineEventHandler, readBody, getRequestHeaders } from 'h3'
import jwt from 'jsonwebtoken'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const jwtSecret = config.jwtSecret

  const headers = getRequestHeaders(event)
  const cookie = headers.cookie || ''

  let userId = null
  let token = null

  try {
    token = cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('jwt='))
      ?.split('=')[1]

    if (token) {
      const decoded = jwt.verify(token, jwtSecret)
      userId = decoded.id
    }
  } catch (err) {
    console.error('JWT decode error:', err)
  }

  console.log('Incoming cookies:', cookie)
  console.log('Token extracted:', token)
  console.log('Decoded user ID:', userId)

  const body = await readBody(event)

  const response = await $fetch(`${backendBase}/order/checkout`, {
    method: 'POST',
    headers: {
      cookie: headers.cookie || ''
    },
    body: {
      ...body,
      userId
    }
  })

  return response
})
