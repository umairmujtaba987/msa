export const reportService = () => {
  const config = useRuntimeConfig()
  const token = () => useCookie('token').value

  const exportBookingsPdfUrl = (query: string) => {
    const base = config.public.apiBaseUrl.replace(/\/$/, '')
    const q = query ? `?${query}` : ''
    return `${base}/reports/bookings/export${q}`
  }

  return {
    exportBookingsPdfUrl,
    exportBookingsPdf: async (query: string) => {
      const headers: Record<string, string> = {}
      const t = token()
      if (t) {
        headers.Authorization = `Bearer ${t}`
      }
      const res = await fetch(exportBookingsPdfUrl(query), {
        method: 'GET',
        headers,
      })
      if (!res.ok) {
        throw new Error('Failed to export PDF')
      }
      return res.blob()
    },
  }
}
