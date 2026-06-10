<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/tasks" class="text-sm text-indigo-600 hover:text-indigo-500">&larr; Back to tasks</NuxtLink>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div v-if="loading">Loading...</div>

      <template v-else-if="task">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ task.title }}</h1>
            <p class="mt-2 text-gray-600">{{ task.description || 'No description' }}</p>
          </div>
          <span :class="statusClass(task.status)" class="px-3 py-1 text-sm font-medium rounded-full">
            {{ task.status }}
          </span>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Assigned to:</span>
            <span class="ml-2 text-gray-900">{{ task.user?.name }}</span>
          </div>
          <div>
            <span class="text-gray-500">Created:</span>
            <span class="ml-2 text-gray-900">{{ new Date(task.createdAt).toLocaleDateString() }}</span>
          </div>
          <div v-if="task.dueDate">
            <span class="text-gray-500">Due date:</span>
            <span class="ml-2 text-gray-900">{{ new Date(task.dueDate).toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="mt-8 flex space-x-4">
          <NuxtLink
            :to="`/tasks/${task.id}/edit`"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit
          </NuxtLink>
          <button
            @click="deleteTask(task.id)"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </template>

      <p v-else class="text-gray-500">Task not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const { fetchById, remove } = useTasks()

const task = ref<Task | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetchById(route.params.id as string)
    if (res.success && res.data) {
      task.value = res.data.data
    }
  } finally {
    loading.value = false
  }
})

async function deleteTask(id: string) {
  if (confirm('Are you sure?')) {
    await remove(id)
    router.push('/tasks')
  }
}

function statusClass(status: string) {
  const classes: Record<string, string> = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    DONE: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return classes[status] || classes.TODO
}
</script>
