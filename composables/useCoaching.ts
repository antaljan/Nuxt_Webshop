// composables/useCoaching.ts
export function useCoaching() {
  /**
   * Mivel Proxy megoldást használsz, minden hívás a Nuxt belső /api mappájába megy.
   * A Nuxt szerver oldali route-jai (pl. server/api/booking/all.get.ts) 
   * fogják hozzáadni a JWT tokent és továbbküldeni a hívást a Node.js felé.
   */

  // --- ADMIN FUNKCIÓK ---

  // Összes slot lekérése (táblázathoz vagy admin naptárhoz)
  const getAllSlots = async () => {
    return await $fetch('/api/booking/all')
  }

  // Új slot létrehozása
  const createSlot = async (slot: { title: string; start: string; end: string; duration: number; slotClass: string }) => {
    return await $fetch('/api/booking/new', {
      method: 'POST',
      body: slot
    })
  }

  // Slot módosítása (időpont, cím vagy státusz)
  const updateSlot = async (id: string, update: any) => {
    return await $fetch(`/api/booking/${id}`, {
      method: 'PUT',
      body: update
    })
  }

  // Slot végleges törlése
  const deleteSlot = async (id: string) => {
    return await $fetch(`/api/booking/${id}`, {
      method: 'DELETE'
    })
  }

  // Slot státuszának "complete"-re állítása (pl. coaching megtörtént)
  const completeSlot = (id: string) => {
  return $fetch(`/api/booking/complete/${id}`, {
    method: 'PUT'
  })
}

  // --- USER (CUSTOMER) FUNKCIÓK ---

  // Csak a szabad (available) slotok lekérése
  const getAvailableSlots = async () => {
    return await $fetch('/api/booking/available')
  }

  // Szűrés adott napra (pl. naptárban egy napra kattintva)
  const getSlotsByDate = async (date: string) => {
    // date: 'YYYY-MM-DD'
    return await $fetch(`/api/booking/by-date/${date}`)
  }

  // Időpont lefoglalása (Customer által)
  const bookSlot = async (id: string, payload: {
    userId: string,
    productId: string,
    purchaseId: string,
    oldBookingId?: string
  }) => {
    return await $fetch(`/api/booking/book/${id}`, {
    method: 'PUT',
    body: payload
  })
}

  // Foglalás lemondása
  const cancelSlot = async (id: string) => {
    return await $fetch(`/api/booking/cancel/${id}`, { method: 'PUT' })
  }

  // az adott user összes foglalásának lekérése 
  const getMyBookings = async () => {
    return await $fetch('/api/booking/mybookings')
  }

  return {
    getAllSlots,
    getAvailableSlots,
    getSlotsByDate,
    createSlot,
    updateSlot,
    deleteSlot,
    bookSlot,
    cancelSlot,
    getMyBookings,
    completeSlot
  }
}
