export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  const requiredRoles = to.meta.roles as string[]

  if (!requiredRoles) return

  const hasRole = requiredRoles.some(role =>
    auth.roles.includes(role)
  )

  if (!hasRole) {
    return navigateTo('/403')
  }
})