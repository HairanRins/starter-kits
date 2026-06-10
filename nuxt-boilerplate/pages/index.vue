<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome back, {{ user?.name }}!</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900">Total Tasks</h3>
        <p class="text-3xl font-bold text-indigo-600 mt-2">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900">In Progress</h3>
        <p class="text-3xl font-bold text-yellow-600 mt-2">{{ stats.inProgress }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900">Completed</h3>
        <p class="text-3xl font-bold text-green-600 mt-2">{{ stats.done }}</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Recent Tasks</h2>
      </div>
      <div class="divide-y">
        <div v-for="task in recentTasks" :key="task.id" class="px-6 py-4 flex items-center justify-between">
          <div>
            <NuxtLink :to="`/tasks/${task.id}`" class="text-sm font-medium text-gray-900 hover:text-indigo-600">
              {{ task.title }}
            </NuxtLink>
            <p v-if="task.description" class="text-sm text-gray-500">{{ task.description }}</p>
          </div>
          <span :class="statusClass(task.status)" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ task.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskStats } from '~/types'

definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
const tasksApi = useTasks()

const recentTasks = ref<Task[]>([])
const stats = ref<TaskStats>({ total: 0, inProgress: 0, done: 0 })

onMounted(async () => {
  const res = await tasksApi.fetchAll({ limit: 5 })
  if (res.success && res.data) {
    recentTasks.value = res.data
    stats.value.total = res.total
    stats.value.inProgress = res.data.filter((t) => t.status === 'IN_PROGRESS').length
    stats.value.done = res.data.filter((t) => t.status === 'DONE').length
  }
})

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
