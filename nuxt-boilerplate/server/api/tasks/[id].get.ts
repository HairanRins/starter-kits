import { taskService } from '../../services/task.service'
import { handleError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const { userId, role } = event.context.auth as { userId: string; role: string }
    const task = await taskService.findById(id, role === 'ADMIN' ? undefined : userId)
    return { success: true, data: task }
  } catch (error) {
    throw handleError(error)
  }
})
