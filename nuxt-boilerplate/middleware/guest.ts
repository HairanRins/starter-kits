export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchUser } = useAuth()

  if (!isAuthenticated.value) {
    try {
      await fetchUser()
    } catch {
      return
    }
  }

  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})
