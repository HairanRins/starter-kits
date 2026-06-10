import { authService } from '../../services/auth.service'
import { loginSchema } from '../../utils/validation'
import { handleError, isZodError, formatZodError } from '../../utils/errors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const input = loginSchema.parse(body)

    const result = await authService.login(input)

    setCookie(event, 'auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return { success: true, data: { user: result.user } }
  } catch (error) {
    if (isZodError(error)) {
      return { success: false, message: 'Validation failed', error: formatZodError(error) }
    }
    throw handleError(error)
  }
})
