export const dashboardService = () => {
  const { $api } = useNuxtApp()

  return {
    getStats: (query: string) => $api(`/dashboard/stats?${query}`),
  }
}
