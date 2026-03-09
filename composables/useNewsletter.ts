export function useNewsletter() {

  /* DASHBOARD SUMMARY */
  const fetchSummary = () =>
    $fetch('/api/dashboard/summary')

  /* CAMPAIGNS */
  const fetchCampaigns = () =>
    $fetch('/api/campaigns')

  const fetchCampaign = (id) =>
    $fetch(`/api/campaigns/${id}`, { method: 'GET' })

  const updateCampaign = (id, payload) =>
    $fetch(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: payload
    })

  /* SUBSCRIBERS */
  const fetchSubscribers = () =>
    $fetch('/api/newsletter/subscribers', { method: 'POST' })

  const deleteSubscriber = (email) =>
    $fetch(`/api/newsletter/unsubscribe/${email}`)

  /* TEMPLATES */
  const fetchTemplates = () =>
    $fetch('/api/newsletter/gettemplates', { method: 'POST' })

  const saveNewsletterTemplate = (payload) =>
    $fetch('/api/newsletter/create/save', {
      method: 'POST',
      body: payload
    })

  const updateNewsletterTemplate = (payload) =>
    $fetch('/api/newsletter/create/update', {
      method: 'PUT',
      body: payload
    })

  const deleteTemplateById = (_id) =>
    $fetch('/api/newsletter/deletetemplate', {
      method: 'POST',
      body: { _id }
    })

  /* SCHEDULING */
  const scheduleNewsletter = (payload) =>
    $fetch('/api/newsletter/schedule', {
      method: 'POST',
      body: payload
    })

  /* EXISTING DASHBOARD ENDPOINTS */
  const fetchCampaignStats = () =>
    $fetch('/api/dashboard/campaigns')

  /* ÚJ — Havi feliratkozók */
  const fetchMonthlySubscribers = () =>
    $fetch('/api/newsletter/stats/monthly-subscribers')

  /* ÚJ — Küldési kapacitás (48h vissza / 48h előre) */
  const fetchSendingCapacity = () =>
    $fetch('/api/newsletter/stats/sending-capacity')

  /* ÚJ — Kampány Pareto diagram */
  const fetchCampaignPareto = () =>
    $fetch('/api/newsletter/stats/campaign-pareto')

  return {
    fetchSummary,

    // Campaigns
    fetchCampaigns,
    fetchCampaign,
    updateCampaign,

    // Subscribers
    fetchSubscribers,
    deleteSubscriber,

    // Templates
    fetchTemplates,
    saveNewsletterTemplate,
    updateNewsletterTemplate,
    deleteTemplateById,

    // Scheduling
    scheduleNewsletter,

    // Dashboard stats
    fetchCampaignStats,
    fetchMonthlySubscribers,
    fetchSendingCapacity,
    fetchCampaignPareto,
  }
}
