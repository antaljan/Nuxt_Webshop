import { ref } from 'vue'

const isOpen = ref(false)

export function useCartDrawer() {
  return {
    isOpen
  }
}
