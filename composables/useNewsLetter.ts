export function useNewsletter() {
  const fetchSummary = () => $fetch('/api/dashboard/summary')
  const fetchCampaigns = () => $fetch('/api/campaigns')

  const fetchSubscribers = () => $fetch('/api/newsletter/subscribers', { method: 'POST' })

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

  const scheduleNewsletter = (payload) =>
    $fetch('/api/newsletter/schedule', {
      method: 'POST',
      body: payload
    })

  const deleteSubscriber = (email) =>
    $fetch(`/api/newsletter/unsubscribe/${email}`)

  const fetchTemplates = () =>
    $fetch('/api/newsletter/gettemplates', { method: 'POST' })

 const deleteTemplateById = (_id) =>
  $fetch('/api/newsletter/deletetemplate', {
    method: 'POST',
    body: { _id }
  })



  return {
    fetchSummary,
    fetchCampaigns,
    fetchSubscribers,
    saveNewsletterTemplate,
    updateNewsletterTemplate,
    scheduleNewsletter,
    fetchTemplates,
    deleteSubscriber,
    deleteTemplateById
  }
}
