export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,

    onRequest({ options }) {
      const token = useCookie('token').value

      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        const token = useCookie('token')
        token.value = null
        const auth = useAuthStore()
        auth.clearAuth()
        navigateTo('/login')
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})