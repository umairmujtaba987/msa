export const roleService = () => {
  const { $api } = useNuxtApp()

  return {
    getAll: () => $api('/roles'),
    create: (body: { name: string }) =>
      $api('/roles', { method: 'POST', body }),
    update: (id: number, body: { name: string }) =>
      $api(`/roles/${id}`, { method: 'PUT', body }),
    delete: (id: number) => $api(`/roles/${id}`, { method: 'DELETE' }),
  }
}