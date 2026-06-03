// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      /** Laravel API prefix, e.g. http://eco-globe.test/api */
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
      /** Laravel app origin for Sanctum CSRF, e.g. http://eco-globe.test */
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    },
  },

  modules: [
    '@ant-design-vue/nuxt',
    '@pinia/nuxt',
    'nuxt-lucide-icons',
    '@nuxtjs/google-fonts',
  ],

  imports: {
    dirs: ['services'],
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
    display: 'swap',
  },
})