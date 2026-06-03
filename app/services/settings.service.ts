export const settingsService = () => {
  const { $api } = useNuxtApp()

  return {
    get: () => $api('/settings'),
    update: (body: Record<string, unknown>) =>
      $api('/settings', { method: 'PUT', body }),
  }
}
