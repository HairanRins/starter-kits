import { userService } from '../../services/user.service'
import { handleError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')!
    const user = await userService.findById(id)
    return { success: true, data: user }
  } catch (error) {
    throw handleError(error)
  }
})
