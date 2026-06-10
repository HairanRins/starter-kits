import { taskService } from '../../services/task.service'
import { updateTaskSchema } from '../../utils/validation'
import { handleError, isZodError, formatZodError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)
    const input = updateTaskSchema.parse(body)
    const { userId } = event.context.auth as { userId: string }

    const task = await taskService.update(id, input, userId)
    return { success: true, data: task }
  } catch (error) {
    if (isZodError(error)) {
      return { success: false, message: 'Validation failed', error: formatZodError(error) }
    }
    throw handleError(error)
  }
})
