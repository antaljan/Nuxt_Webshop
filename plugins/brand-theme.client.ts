import { useBrand } from '@/composables/useBrand'
import { useTheme } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    setup() {
      const { settings, loadBrand } = useBrand()
      const theme = useTheme()

      loadBrand().then(() => {
        if (!settings.value) return
        const s = settings.value

        theme.themes.value.brandTheme.colors.primary = s.primaryColor
        theme.themes.value.brandTheme.colors.secondary = s.accentColor
        theme.themes.value.brandTheme.colors.background = s.backgroundColor
        theme.themes.value.brandTheme.colors.surface = s.backgroundColor
        theme.themes.value.brandTheme.colors.info = s.accentColor
        theme.themes.value.brandTheme.colors.success = s.accentColor
        theme.themes.value.brandTheme.colors.warning = s.accentColor
        theme.themes.value.brandTheme.colors.error = s.primaryColor

        theme.global.name.value = 'brandTheme'
      })
    }
  }
})
