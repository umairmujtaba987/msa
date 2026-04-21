export const userService = () => {
  const { $api } = useNuxtApp()

  return {
    getAll: () => $api('/users'),
    get: (id: number) => $api(`/users/${id}`),
    create: (data: any) => $api('/users', { method: 'POST', body: data }),
    update: (id: number, data: any) =>
      $api(`/users/${id}`, { method: 'PUT', body: data }),
    delete: (id: number) =>
      $api(`/users/${id}`, { method: 'DELETE' }),
  }
}