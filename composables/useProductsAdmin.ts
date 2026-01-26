export const useProductsAdmin = () => {
  const config = useRuntimeConfig()
  const backend = config.public.backendBase

  const getAllProducts = () => {
    return $fetch(`${backend}/products`, {
      credentials: 'include'
    })
  }

  const getProduct = (id: string) => {
    return $fetch(`${backend}/products/${id}`, {
      credentials: 'include'
    })
  }

  const createProduct = (payload: any) => {
    return $fetch(`${backend}/products`, {
      method: 'POST',
      body: payload,
      credentials: 'include'
    })
  }

  const updateProduct = (id: string, payload: any) => {
    return $fetch(`${backend}/products/${id}`, {
      method: 'PUT',
      body: payload,
      credentials: 'include'
    })
  }

  const deleteProduct = (id: string) => {
    return $fetch(`${backend}/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  return {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}