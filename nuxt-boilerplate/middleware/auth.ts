export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchUser } = useAuth()

  if (!isAuthenticated.value) {
    try {
      await fetchUser()
    } catch {
      return navigateTo('/auth/login')
    }
  }

  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})
