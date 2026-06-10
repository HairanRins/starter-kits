import type { UpdateUserRequest, QueryParams, User, ApiResponse, PaginatedResponse } from '~/types'

export const useUsers = () => {
  const api = useApi()
  const loading = useState<boolean>('users_loading', () => false)

  async function fetchAll(params?: QueryParams) {
    loading.value = true
    try {
      return await api.getPaginated<User>('/users', params as Record<string, unknown>)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      return await api.get<{ data: User }>(`/users/${id}`)
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, input: UpdateUserRequest) {
    loading.value = true
    try {
      return await api.put<{ data: User }>(`/users/${id}`, input)
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    try {
      return await api.delete<{ message: string }>(`/users/${id}`)
    } finally {
      loading.value = false
    }
  }

  return { fetchAll, fetchById, update, remove, loading }
}
