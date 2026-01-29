// server/api/upload/index.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Kinyerjük a multipart form adatokat
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'Nincs adat' })
  }

  // Új FormData objektumot építünk a backendnek
  const body = new FormData()
  formData.forEach((item) => {
    if (item.name) {
      if (item.filename) {
        // Fájl esetén (blob)
        const blob = new Blob([item.data], { type: item.type })
        body.append(item.name, blob, item.filename)
      } else {
        // Sima szöveges mező esetén
        body.append(item.name, item.data.toString())
      }
    }
  })

  return await $fetch(`${config.public.backendBase}/upload`, {
    method: 'POST',
    body
  })
})
