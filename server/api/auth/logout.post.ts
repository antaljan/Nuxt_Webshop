export default defineEventHandler(async (event) => {
  deleteCookie(event, 'jwt', { path: '/' })
  return { success: true }
})
