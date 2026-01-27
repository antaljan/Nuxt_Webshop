import { defineEventHandler, getRequestHeaders } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  const headers = getRequestHeaders(event)
  console.log("Nuxt incoming cookies:", headers.cookie)
  // Továbbítjuk a cookie-t a backendnek
  const response = await $fetch(`${backendBase}/user/purchases`, {
    headers: {
      cookie: headers.cookie || ''
    }
  })

  return response
})