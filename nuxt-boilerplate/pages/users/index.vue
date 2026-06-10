<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Users</h1>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b">
        <input
          v-model="search"
          type="text"
          placeholder="Search users..."
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in users" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="item.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ item.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(item.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>

      <div class="px-6 py-4 border-t flex items-center justify-between">
        <p class="text-sm text-gray-600">Page {{ page }} of {{ totalPages }}</p>
        <div class="flex space-x-2">
          <button :disabled="page <= 1" @click="page--" class="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
          <button :disabled="page >= totalPages" @click="page++" class="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({ middleware: 'auth' })

const { fetchAll } = useUsers()

const users = ref<User[]>([])
const page = ref(1)
const totalPages = ref(0)
const search = ref('')

let debounceTimer: ReturnType<typeof setTimeout>

watch([search, page], () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(loadUsers, 300)
})

onMounted(loadUsers)

async function loadUsers() {
  const params: Record<string, unknown> = { page: page.value }
  if (search.value) params.search = search.value

  const res = await fetchAll(params)
  if (res.success && res.data) {
    users.value = res.data
    totalPages.value = res.totalPages
  }
}
</script>
