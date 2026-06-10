import { taskService } from '../../services/task.service'
import { handleError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const { userId } = event.context.auth
    await taskService.delete(id, userId)
    return { success: true, message: 'Task deleted successfully' }
  } catch (error) {
    throw handleError(error)
  }
})
