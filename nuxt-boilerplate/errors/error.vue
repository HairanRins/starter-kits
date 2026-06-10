<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">{{ error.statusCode || 500 }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ error.message || 'An unexpected error occurred' }}</p>
      <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-500">
        Go back home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode?: number; message?: string } }>()
</script>
