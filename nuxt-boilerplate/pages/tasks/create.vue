<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/tasks" class="text-sm text-indigo-600 hover:text-indigo-500">&larr; Back to tasks</NuxtLink>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6 max-w-lg">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ submitting ? 'Creating...' : 'Create Task' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiResponse, CreateTaskRequest, TaskStatus } from '~/types'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { create } = useTasks()

const form = reactive<CreateTaskRequest>({ title: '', description: '', status: 'TODO' as TaskStatus })
const error = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    await create(form)
    router.push('/tasks')
  } catch (err: unknown) {
    const apiError = err as { data?: ApiResponse }
    error.value = apiError?.data?.message || 'Failed to create task'
  } finally {
    submitting.value = false
  }
}
</script>
