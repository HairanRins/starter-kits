import type { CreateTaskRequest, UpdateTaskRequest, QueryParams, Task, PaginatedResponse } from '~/types'

export const useTasks = () => {
  const api = useApi()
  const loading = useState<boolean>('tasks_loading', () => false)

  async function fetchAll(params?: QueryParams) {
    loading.value = true
    try {
      return await api.getPaginated<Task>('/tasks', params as Record<string, unknown>)
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      return await api.get<{ data: Task }>(`/tasks/${id}`)
    } finally {
      loading.value = false
    }
  }

  async function create(input: CreateTaskRequest) {
    loading.value = true
    try {
      return await api.post<{ data: Task }>('/tasks', input)
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, input: UpdateTaskRequest) {
    loading.value = true
    try {
      return await api.put<{ data: Task }>(`/tasks/${id}`, input)
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    try {
      return await api.delete<{ message: string }>(`/tasks/${id}`)
    } finally {
      loading.value = false
    }
  }

  return { fetchAll, fetchById, create, update, remove, loading }
}
