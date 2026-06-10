export default defineEventHandler(() => {
  return {
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  }
})
