<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              Nuxt Boilerplate
            </NuxtLink>
            <div class="ml-10 flex items-center space-x-4">
              <NuxtLink to="/" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </NuxtLink>
              <NuxtLink to="/tasks" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Tasks
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">{{ user?.name }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
}
</script>
