<template>
  <div class="bg-white rounded-lg shadow p-8">
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-8">Create Account</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          minlength="8"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {{ loading ? 'Loading...' : 'Sign Up' }}
      </button>

      <p class="text-center text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-indigo-600 hover:text-indigo-500">Sign in</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse } from '~/types'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { register } = useAuth()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await register(form)
    router.push('/')
  } catch (err: unknown) {
    const apiError = err as { data?: ApiResponse }
    error.value = apiError?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>
