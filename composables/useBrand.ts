import { ref } from 'vue';

export function useBrand() {
  const settings = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // GET brand settings
  async function loadBrand() {
    loading.value = true;
    try {
      settings.value = await $fetch('/api/admin/brand');
    } catch (err) {
      console.error('Failed to load brand settings:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  // PUT brand settings
  async function saveBrand(newSettings) {
    loading.value = true;
    try {
      settings.value = await $fetch('/api/admin/brand', {
        method: 'PUT',
        body: newSettings
      });
    } catch (err) {
      console.error('Failed to save brand settings:', err);
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  return {
    settings,
    loading,
    error,
    loadBrand,
    saveBrand
  };
}
