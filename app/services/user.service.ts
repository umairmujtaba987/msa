export const userService = () => {
  const { $api } = useNuxtApp()

  return {
    getAll: () => $api('/users'),
    /** Query string without leading `?`, e.g. `page=1&per_page=10` */
    list: (query: string) => $api(`/users?${query}`),
    get: (id: number) => $api(`/users/${id}`),
    create: (data: unknown) => $api('/users', { method: 'POST', body: data }),
    update: (id: number, data: unknown) =>
      $api(`/users/${id}`, { method: 'PUT', body: data }),
    delete: (id: number) =>
      $api(`/users/${id}`, { method: 'DELETE' }),
  }
}