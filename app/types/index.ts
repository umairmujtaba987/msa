export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
  roles?: Role[]
}

export interface Role {
  id: number
  name: string
  guard_name: string
  pivot?: {
    model_id: number
    model_type: string
    role_id: number
  }
}

export interface AuthPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  roles: string[]
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface Role as RoleType {
  id: number
  name: string
  guard_name: string
}