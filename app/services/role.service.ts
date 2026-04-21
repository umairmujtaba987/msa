export const roleService = () => {
  const { $api } = useNuxtApp()

  return {
    getAll: () => $api('/roles'),
  }
}