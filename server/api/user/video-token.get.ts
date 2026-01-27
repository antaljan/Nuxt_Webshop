import { defineEventHandler } from '#imports'
import { getHeader, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backend = config.public.backendBase

  const { purchaseId } = getQuery(event)

  return await $fetch(`${backend}/user/video-token`, {
    headers: {
      cookie: getHeader(event, 'cookie') || ''
    },
    params: { purchaseId }
  })
})