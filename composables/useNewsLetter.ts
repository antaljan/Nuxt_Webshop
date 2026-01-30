// composables/useNewsletter.ts
export function useNewsletter() {
  const fetchSummary = () => $fetch('/api/dashboard/summary')
  const fetchCampaigns = () => $fetch('/api/dashboard/campaigns')
  const fetchSubscribers = () => $fetch('/api/newsletter/subscribers', { method: 'POST' })

  // ÚJ: Mentés hozzáadása a composable-höz
  const saveNewsletterTemplate = (payload: any) => $fetch('/api/newsletter/create/save', {
    method: 'POST',
    body: payload
  })

  return { 
    fetchSummary, 
    fetchCampaigns, 
    fetchSubscribers,
    saveNewsletterTemplate // Ezt fogjuk hívni a create.vue-ból
  }
}
