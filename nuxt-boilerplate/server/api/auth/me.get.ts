import { authService } from '../../services/auth.service'
import { handleError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const { userId } = event.context.auth
    const result = await authService.getMe(userId)
    return { success: true, data: result }
  } catch (error) {
    throw handleError(error)
  }
})
