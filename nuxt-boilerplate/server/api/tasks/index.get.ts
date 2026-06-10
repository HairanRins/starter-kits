import { taskService } from '../../services/task.service'
import { querySchema } from '../../utils/validation'
import { handleError, isZodError, formatZodError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const params = querySchema.parse(query)
    const { role, userId } = event.context.auth as { role: string; userId: string }

    const result = await taskService.findAll({
      ...params,
      userId: role === 'ADMIN' ? undefined : userId,
    })

    return { success: true, ...result }
  } catch (error) {
    if (isZodError(error)) {
      return { success: false, message: 'Validation failed', error: formatZodError(error) }
    }
    throw handleError(error)
  }
})
