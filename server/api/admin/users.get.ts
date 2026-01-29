const config = useRuntimeConfig()
const backendBase = config.public.backendBase

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'jwt')
  return await $fetch(`${config.public.backendBase}/user/get`, {
    method: 'POST',
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {}
  }).catch(err => {
    console.error('Backend Error:', err.status, err.data);
    throw err;
  });
})
