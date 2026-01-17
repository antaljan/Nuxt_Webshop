export const useContent = () => {
  const getSection = async (section: string, language: string) => {
    return await $fetch(`/api/content/${section}/${language}`)
  }

  const updateSection = async (section: string, language: string, data: any) => {
    return await $fetch(`/api/content/${section}/${language}`, {
      method: 'PUT',
      body: data
    })
  }

  return { getSection, updateSection }
}
