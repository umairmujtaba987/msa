import { defineStore } from 'pinia'
import type { User, PaginatedResponse } from '~/types'

interface UsersState {
  users: User[]
  loading: boolean
  pagination: {
    currentPage: number
    perPage: number
    total: number
    lastPage: number
  }
  search: string
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    loading: false,
    pagination: {
      currentPage: 1,
      perPage: 10,
      total: 0,
      lastPage: 1,
    },
    search: '',
  }),

  getters: {
    hasUsers: (state) => state.users.length > 0,
  },

  actions: {
    async fetchUsers(page = 1, search = '') {
      this.loading = true
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: this.pagination.perPage.toString(),
        })

        if (search) {
          params.append('search', search)
        }

        const res: PaginatedResponse<User> = await userService().list(params.toString())

        this.users = res.data
        this.pagination = {
          currentPage: res.current_page,
          perPage: res.per_page,
          total: res.total,
          lastPage: res.last_page,
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(data: Partial<User>) {
      this.loading = true
      try {
        const res: User = await userService().create(data)
        
        this.users.unshift(res)
        this.pagination.total++
        
        return res
      } catch (error) {
        console.error('Failed to create user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, data: Partial<User>) {
      this.loading = true
      try {
        const res: User = await userService().update(id, data)
        
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...res }
        }
        
        return res
      } catch (error) {
        console.error('Failed to update user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      try {
        await userService().delete(id)
        
        this.users = this.users.filter(u => u.id !== id)
        this.pagination.total--
        
        return true
      } catch (error) {
        console.error('Failed to delete user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUser(id: number) {
      try {
        const res: User = await userService().get(id)
        return res
      } catch (error) {
        console.error('Failed to get user:', error)
        throw error
      }
    },

    setSearch(search: string) {
      this.search = search
    },

    setPage(page: number) {
      this.pagination.currentPage = page
    },

    reset() {
      this.users = []
      this.loading = false
      this.pagination = {
        currentPage: 1,
        perPage: 10,
        total: 0,
        lastPage: 1,
      }
      this.search = ''
    },
  },
})