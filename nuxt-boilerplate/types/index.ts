import type { TaskStatus, UserRole } from '@prisma/client'

export type { TaskStatus, UserRole }

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface UserWithPassword extends User {
  password: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  dueDate: string | null
  userId: string
  user?: Pick<User, 'id' | 'name' | 'email'>
  createdAt: string
  updatedAt: string
}

export interface TaskStats {
  total: number
  inProgress: number
  done: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: unknown
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
}

export interface CreateTaskRequest {
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: TaskStatus
  dueDate?: string | null
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  avatar?: string | null
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  status?: TaskStatus
}
