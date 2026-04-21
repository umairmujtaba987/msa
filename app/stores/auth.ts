import { defineStore } from 'pinia'
import type { User, Role, LoginResponse } from '~/types'

interface AuthState {
  user: User | null
  roles: string[]
  token: string | null
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    roles: [],
    token: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    hasRole: (state) => (role: string) => state.roles.includes(role),
    hasAnyRole: (state) => (roles: string[]) => roles.some(r => state.roles.includes(r)),
    isSuperadmin: (state) => state.roles.includes('superadmin'),
    isAdminManager: (state) => state.roles.includes('admin_manager'),
  },

  actions: {
    init() {
      const cookieToken = useCookie<string | null>('token').value
      if (cookieToken) {
        this.token = cookieToken
      }

      if (import.meta.client) {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (!this.token && storedToken) {
          this.token = storedToken
          useCookie('token').value = storedToken
        }

        if (storedUser) {
          try {
            this.user = JSON.parse(storedUser)
            const roles = localStorage.getItem('roles')
            if (roles) {
              this.roles = JSON.parse(roles)
            }
          } catch (e) {
            console.error('Failed to parse stored user:', e)
          }
        }
      }
      this.initialized = true
    },

    async initSession() {
      if (!this.initialized) {
        this.init()
      }

      if (!this.token) {
        return
      }

      try {
        await this.fetchProfile()
      } catch {
        this.clearAuth()
      }
    },

    async login(payload: { email: string; password: string }) {
      try {
        const { $api } = useNuxtApp()

        const res: LoginResponse = await $api('/login', {
          method: 'POST',
          body: payload,
        })

        this.token = res.token
        this.user = res.user
        this.roles = res.roles

        if (import.meta.client) {
          localStorage.setItem('token', res.token)
          localStorage.setItem('user', JSON.stringify(res.user))
          localStorage.setItem('roles', JSON.stringify(res.roles))
        }

        useCookie('token').value = res.token

        return res
      } catch (error: any) {
        throw error?.data?.message || 'Login failed'
      }
    },

    async fetchProfile() {
      try {
        const { $api } = useNuxtApp()
        const res: any = await $api('/profile')
        const profile = res?.data ?? res

        this.token = useCookie('token').value || this.token
        this.user = profile
        this.roles = profile.roles?.map((r: Role) => r.name) || []

        if (import.meta.client) {
          localStorage.setItem('user', JSON.stringify(profile))
          localStorage.setItem('roles', JSON.stringify(this.roles))
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        throw error
      }
    },

    logout() {
      const logout = async () => {
        try {
          const { $api } = useNuxtApp()
          await $api('/logout', { method: 'POST' })
        } catch (e) {
          console.error('Logout API call failed:', e)
        } finally {
          this.clearAuth()
          navigateTo('/login')
        }
      }

      logout()
    },

    clearAuth() {
      this.token = null
      this.user = null
      this.roles = []

      useCookie('token').value = null

      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('roles')
      }
    },
  },
})