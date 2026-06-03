/**
 * Booking and booking-config API (relative to `runtimeConfig.public.apiBaseUrl`).
 */
export const bookingService = () => {
  const { $api } = useNuxtApp()

  return {
    getConfig: () => $api('/booking-config'),
    list: (query: string) => $api(`/bookings?${query}`),
    create: (body: Record<string, unknown>) =>
      $api('/bookings', { method: 'POST', body }),
    update: (id: number, body: Record<string, unknown>) =>
      $api(`/bookings/${id}`, { method: 'PUT', body }),
    calculatePrice: (body: Record<string, unknown>) =>
      $api('/bookings/calculate-price', { method: 'POST', body }),
    patchStatus: (id: number, action: 'paid' | 'confirm' | 'cancel') =>
      $api(`/bookings/${id}/${action}`, { method: 'PATCH' }),
  }
}
