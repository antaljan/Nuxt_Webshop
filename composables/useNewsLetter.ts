export function useNewsletter() {
  /* DASHBOARD */
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
    scheduleNewsletter
  }
}
