import { $fetch as ofetch } from 'ofetch'
import type { ApiResponse, PaginatedResponse } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  function request<T>(url: string, options: Record<string, string | undefined> = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    return ofetch(`${baseURL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    }).catch((error: Error & { response?: { status: number } }) => {
      if (error?.response?.status === 401) {
        const auth = useAuth()
        auth.clearAuth()
        navigateTo('/auth/login')
      }
      throw error
    }) as Promise<T>
  }

  function buildQuery(params?: Record<string, unknown>): string {
    if (!params) return ''
    const entries = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== ''
    )
    if (entries.length === 0) return ''
    return '?' + new URLSearchParams(
      entries.map(([k, v]) => [k, String(v)])
    ).toString()
  }

  return {
    get<T>(url: string, params?: Record<string, unknown>) {
      return request<ApiResponse<T>>(`${url}${buildQuery(params)}`)
    },

    post<T>(url: string, body?: unknown) {
      return request<ApiResponse<T>>(url, { method: 'POST', body: JSON.stringify(body) })
    },

    put<T>(url: string, body?: unknown) {
      return request<ApiResponse<T>>(url, { method: 'PUT', body: JSON.stringify(body) })
    },

    delete<T>(url: string) {
      return request<ApiResponse<T>>(url, { method: 'DELETE' })
    },

    getPaginated<T>(url: string, params?: Record<string, unknown>) {
      return request<PaginatedResponse<T>>(`${url}${buildQuery(params)}`)
    },
  }
}
