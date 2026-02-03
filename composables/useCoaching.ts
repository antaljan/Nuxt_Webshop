// composables/useCoaching.ts
export function useCoaching() {
  const config = useRuntimeConfig()

  // ADMIN: összes slot
  const getAllSlots = async () => {
    return await $fetch(`/api/booking/all`, {
    })
  }

  // USER: elérhető slotok
  const getAvailableSlots = async () => {
    return await $fetch(`api/booking/available`, {
    })
  }

  // USER: adott nap slotjai
  const getSlotsByDate = async (date: string) => {
    return await $fetch(`api/booking/by-date/${date}`, {
    })
  }

  // ADMIN: új slot
  const createSlot = async (slot: any) => {
    return await $fetch(`api/booking/new`, {
      method: 'POST',
      body: slot,
    })
  }

  // ADMIN: slot törlése
  const deleteSlot = async (id: string) => {
    return await $fetch(`api/booking/${id}`, {
      method: 'DELETE',
    })
  }

  // ADMIN: slot módosítása
  const updateSlot = async (id: string, update: any) => {
    return await $fetch(`api/booking/${id}`, {
      method: 'PUT',
      body: update,
    })
  }

  // USER: foglalás
  const bookSlot = async (id: string, payload: any) => {
    return await $fetch(`api/booking/book/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  // USER: lemondás
  const cancelSlot = async (id: string) => {
    return await $fetch(`api/booking/cancel/${id}`, {
      method: 'PUT',
    })
  }

  return {
    getAllSlots,
    getAvailableSlots,
    getSlotsByDate,
    createSlot,
    deleteSlot,
    updateSlot,
    bookSlot,
    cancelSlot
  }
}