import { userService } from '../../services/user.service'
import { updateUserSchema } from '../../utils/validation'
import { handleError, isZodError, formatZodError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const body = await readBody(event)
    const input = updateUserSchema.parse(body)
    const user = await userService.update(id, input)
    return { success: true, data: user }
  } catch (error) {
    if (isZodError(error)) {
      return { success: false, message: 'Validation failed', error: formatZodError(error) }
    }
    throw handleError(error)
  }
})
