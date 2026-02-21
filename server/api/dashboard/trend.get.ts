// server/api/dashboard/trend.get.ts
import { defineEventHandler } from 'h3'
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase
  const token = getCookie(event, 'jwt')
  return await $fetch(`${backendBase}/dashboard/trend`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
