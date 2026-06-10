import { taskService } from '../../services/task.service'
import { createTaskSchema } from '../../utils/validation'
import { handleError, isZodError, formatZodError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const input = createTaskSchema.parse(body)
    const { userId } = event.context.auth as { userId: string }

    const task = await taskService.create(input, userId)
    return { success: true, data: task }
  } catch (error) {
    if (isZodError(error)) {
      return { success: false, message: 'Validation failed', error: formatZodError(error) }
    }
    throw handleError(error)
  }
})
