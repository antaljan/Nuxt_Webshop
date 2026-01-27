import { defineEventHandler } from '#imports'
import { getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const config = useRuntimeConfig()
  const backend = config.public.backendBase

  return await $fetch(`${backend}/user/product/${id}`, {
    headers: {
      cookie: getHeader(event, 'cookie') || ''
    }
  })
})