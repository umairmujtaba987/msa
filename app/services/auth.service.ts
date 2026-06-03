export const authService = () => {
  const { $api } = useNuxtApp()

  return {
    login: (body: { email: string; password: string }) =>
      $api('/login', { method: 'POST', body }),
    profile: () => $api('/profile'),
    updateProfile: (body: Record<string, unknown>) =>
      $api('/profile', { method: 'PUT', body }),
    logout: () => $api('/logout', { method: 'POST' }),
  }
}
