export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()

  // Ensure user/roles are restored from API on hard reload.
  await auth.initSession()
})
