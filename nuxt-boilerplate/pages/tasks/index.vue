<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
      <NuxtLink to="/tasks/create" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
        New Task
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b">
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            v-model="search"
            type="text"
            placeholder="Search tasks..."
            class="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          <select v-model="statusFilter" class="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none">
            <option value="">All Status</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div class="divide-y">
        <div v-for="task in tasks" :key="task.id" class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
          <div class="flex-1">
            <NuxtLink :to="`/tasks/${task.id}`" class="text-sm font-medium text-gray-900 hover:text-indigo-600">
              {{ task.title }}
            </NuxtLink>
            <p class="text-sm text-gray-500">{{ task.description }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ task.user?.name }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span :class="statusClass(task.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ task.status }}
            </span>
            <button @click="deleteTask(task.id)" class="text-red-500 hover:text-red-700 text-sm">Delete</button>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Page {{ page }} of {{ totalPages }} ({{ total }} total)
        </p>
        <div class="flex space-x-2">
          <button
            :disabled="page <= 1"
            @click="page--"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            :disabled="page >= totalPages"
            @click="page++"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

definePageMeta({ middleware: 'auth' })

const { fetchAll, remove } = useTasks()

const tasks = ref<Task[]>([])
const page = ref(1)
const limit = 10
const total = ref(0)
const totalPages = ref(0)
const search = ref('')
const statusFilter = ref('')

let debounceTimer: ReturnType<typeof setTimeout>

watch([search, statusFilter, page], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(loadTasks, 300)
})

onMounted(loadTasks)

async function loadTasks() {
  const params: Record<string, unknown> = { page: page.value, limit }
  if (search.value) params.search = search.value
  if (statusFilter.value) params.status = statusFilter.value

  const res = await fetchAll(params)
  if (res.success && res.data) {
    tasks.value = res.data
    total.value = res.total
    totalPages.value = res.totalPages
  }
}

async function deleteTask(id: string) {
  if (confirm('Are you sure you want to delete this task?')) {
    await remove(id)
    loadTasks()
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
