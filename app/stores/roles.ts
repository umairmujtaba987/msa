import { defineStore } from 'pinia'
import type { Role } from '~/types'

interface RolesState {
  roles: Role[]
  loading: boolean
}

export const useRolesStore = defineStore('roles', {
  state: (): RolesState => ({
    roles: [],
    loading: false,
  }),

  getters: {
    getRoleById: (state) => (id: number) => state.roles.find(r => r.id === id),
    getRoleByName: (state) => (name: string) => state.roles.find(r => r.name === name),
  },

  actions: {
    async fetchRoles() {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const res: Role[] = await $api('/roles')
        this.roles = res
      } catch (error) {
        console.error('Failed to fetch roles:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createRole(data: Partial<Role>) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const res: Role = await $api('/roles', {
          method: 'POST',
          body: data,
        })
        this.roles.push(res)
        return res
      } catch (error) {
        console.error('Failed to create role:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRole(id: number, data: Partial<Role>) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const res: Role = await $api(`/roles/${id}`, {
          method: 'PUT',
          body: data,
        })
        
        const index = this.roles.findIndex(r => r.id === id)
        if (index !== -1) {
          this.roles[index] = res
        }
        
        return res
      } catch (error) {
        console.error('Failed to update role:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRole(id: number) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        await $api(`/roles/${id}`, {
          method: 'DELETE',
        })
        this.roles = this.roles.filter(r => r.id !== id)
        return true
      } catch (error) {
        console.error('Failed to delete role:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.roles = []
      this.loading = false
    },
  },
})