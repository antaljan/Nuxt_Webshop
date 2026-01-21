// composables/useProducts.ts
import { useCookie, useRuntimeConfig } from '#imports'

export function useProducts() {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  // SSR-safe cart stored in a normal cookie (not httpOnly)
  const cart = useCookie('cart', {
    default: () => [],
    watch: true
  })

  // -----------------------------
  // GET ALL PRODUCTS
  // -----------------------------
  async function getProducts() {
    try {
      const { data, error } = await useFetch(`${backendBase}/products`, {
        method: 'GET'
      })

      if (error.value) {
        console.error('Product fetch error:', error.value)
        return []
      }

      return data.value || []
    } catch (err) {
      console.error('Unexpected product fetch error:', err)
      return []
    }
  }

  // -----------------------------
  // GET ONE PRODUCT BY ID
  // -----------------------------
  async function getProduct(id: string) {
    try {
      const { data, error } = await useFetch(`${backendBase}/products/${id}`, {
        method: 'GET'
      })

      if (error.value) {
        console.error('Single product fetch error:', error.value)
        return null
      }

      return data.value
    } catch (err) {
      console.error('Unexpected single product fetch error:', err)
      return null
    }
  }

  // -----------------------------
  // ADD TO CART
  // -----------------------------
  function addToCart(product: any) {
    const current = cart.value || []
    current.push(product)
    cart.value = current
  }

  // -----------------------------
  // REMOVE FROM CART
  // -----------------------------
  function removeFromCart(index: number) {
    const current = cart.value || []
    current.splice(index, 1)
    cart.value = current
  }

  // -----------------------------
  // CLEAR CART
  // -----------------------------
  function clearCart() {
    cart.value = []
  }

  // -----------------------------
  // CALCULATE TOTAL
  // -----------------------------
  function cartTotal() {
    return (cart.value || []).reduce((sum: number, item: any) => {
      return sum + Number(item.price)
    }, 0)
  }

  // -----------------------------
  // CHECKOUT (backend order creation)
  // -----------------------------
  async function checkout() {
    try {
      const { data, error } = await useFetch(`${backendBase}/orders/checkout`, {
        method: 'POST',
        body: {
          items: cart.value
          // ide később beteheted a userId-t is, ha a backend a JWT-ből nem szedi ki
        },
        credentials: 'include'
      })

      if (error.value) {
        console.error('Checkout error:', error.value)
        return
      }

      const url = data.value?.url
      if (url) {
        // redirect Stripe Checkout-ra
        window.location.href = url
      }
    } catch (err) {
      console.error('Unexpected checkout error:', err)
    }
  }

  return {
    getProducts,
    getProduct,
    addToCart,
    removeFromCart,
    clearCart,
    cart,
    cartTotal,
    checkout
  }
}
