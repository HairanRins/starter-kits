import type { LoginRequest, RegisterRequest, User, ApiResponse } from '~/types'

export const useAuth = () => {
  const user = useState<User | null>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  const api = useApi()

  async function login(input: LoginRequest) {
    loading.value = true
    try {
      const res = await api.post<{ user: User }>('/auth/login', input)
      if (res.success && res.data) {
        user.value = res.data.user
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function register(input: RegisterRequest) {
    loading.value = true
    try {
      const res = await api.post<{ user: User }>('/auth/register', input)
      if (res.success && res.data) {
        user.value = res.data.user
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      user.value = null
      navigateTo('/auth/login')
    }
  }

  async function fetchUser() {
    loading.value = true
    try {
      const res = await api.get<{ user: User }>('/auth/me')
      if (res.success && res.data) {
        user.value = res.data.user
      }
      return res
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  function clearAuth() {
    user.value = null
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    clearAuth,
  }
}
