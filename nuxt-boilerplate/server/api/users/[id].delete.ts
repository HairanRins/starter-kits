import { userService } from '../../services/user.service'
import { handleError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    await userService.delete(id)
    return { success: true, message: 'User deleted successfully' }
  } catch (error) {
    throw handleError(error)
  }
})
