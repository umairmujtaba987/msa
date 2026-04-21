export default defineNuxtRouteMiddleware((to) => {
  const isGuestRoute = to.path === '/login' || to.path === '/register';
  if (!isGuestRoute) return;
  const token = useCookie('token').value
  if (token) {
    return navigateTo('/dashboard');
  }
});
