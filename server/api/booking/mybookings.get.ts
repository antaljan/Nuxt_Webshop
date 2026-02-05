// frontend/server/api/booking/mybookings.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = getCookie(event, 'jwt')
    if (!token) {
        throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: No token found',
        })
    }
    try {
        return await $fetch(`${config.public.backendBase}/booking/mybookings`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.message || 'Backend error',
        })
    }
})