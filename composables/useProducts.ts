// composables/useProducts.ts
import { useCookie, useRuntimeConfig, useRoute, navigateTo } from '#imports'
import { useAuth } from '~/composables/useAuth'
import { useCartDrawer } from '~/composables/useCartDrawer'

export function useProducts() {
  const config = useRuntimeConfig()
  const backendBase = config.public.backendBase

  // Global cart stored in cookie
  const cart = useCookie('cart', {
  default: () => [],
  watch: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7
})

  const { isOpen } = useCartDrawer()

  // -----------------------------
  // GET ALL PRODUCTS
  // -----------------------------
  async function getProducts() {
    try {
      const { data, error } = await useFetch(`${backendBase}/products`)
      if (error.value) return []
      return data.value || []
    } catch {
      return []
    }
  }

  // -----------------------------
  // GET ONE PRODUCT
  // -----------------------------
  async function getProduct(id: string) {
    try {
      const { data, error } = await useFetch(`${backendBase}/products/${id}`)
      if (error.value) return null
      return data.value
    } catch {
      return null
    }
  }

  // -----------------------------
  // ADD TO CART
  // -----------------------------
  function addToCart(product: any) {
    // 1. Meglévő elemek másolása (hogy ne mutáció legyen)
    const currentItems = cart.value ? [...cart.value] : []
    
    // 2. Új objektum összeállítása
    const minimalProduct = {
      _id: product._id,
      title: product.title,
      price: Number(product.price),
      cover: product.cover // Ezt add hozzá, hogy a CartDrawer-ben látszódjon a kép!
    }
    
    // 3. HOZZÁADÁS A LISTÁHOZ (ez hiányzott)
    currentItems.push(minimalProduct)
    
    // 4. SÜTI FRISSÍTÉSE
    cart.value = currentItems
    
    // 5. Opcionális: Kosár automatikus megnyitása
    isOpen.value = true
    
    //console.log('Süti frissítve, elemek száma:', cart.value.length)
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
  // CART TOTAL
  // -----------------------------
  function cartTotal() {
    return (cart.value || []).reduce((sum: number, item: any) => {
      return sum + Number(item.price)
    }, 0)
  }

  // -----------------------------
  // CHECKOUT
  // -----------------------------
  async function checkout() {
    const { user, loggedIn } = useAuth()
    console.log('User in checkout:', user.value)
    if (!loggedIn.value) {
      const current = useRoute().fullPath
      return navigateTo(`/login?redirect=${encodeURIComponent(current)}`)
    }
    

    const { data, error } = await useFetch('/api/checkout', {
      method: 'POST',
      body: {
        items: cart.value,
        userId: user.value?._id
      }
    })
    console.log("SSR forwarded userId:", data.value.forwardedUserId)

    if (error.value) {
      console.error('Checkout error:', error.value)
      return
    }

    if (data.value?.url) {
      window.location.href = data.value.url
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
