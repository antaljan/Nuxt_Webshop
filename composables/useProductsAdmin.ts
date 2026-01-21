export function useProductsAdmin() {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  async function getProduct(id) {
    return await $fetch(`${backendBase}/products/${id}`)
  }

  async function createProduct(data) {
    return await $fetch(`${backendBase}/products`, {
      method: 'POST',
      body: data
    })
  }

  async function updateProduct(id, data) {
    return await $fetch(`${backendBase}/products/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async function deleteProduct(id) {
    return await $fetch(`${backendBase}/products/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
